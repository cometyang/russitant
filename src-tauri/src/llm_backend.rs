use crate::AppState;
//use clap::Parser;
use llm::{models::Llama, Model, ModelArchitecture};
use llm::{InferenceError, InferenceFeedback, InferenceStats, LoadError};
//use rustyline::error::ReadlineError;
use std::sync::Mutex;
use std::{convert::Infallible, path::PathBuf};
use std::{io::Write, str::FromStr};
use tauri::Manager;
use tauri_plugin_store::{Store, StoreBuilder};

pub struct ChatState {
  pub messages: Mutex<Vec<Message>>,
}
pub struct Message {
  text: String,
  role: MessageRole,
}

#[derive(Debug)]
pub enum MessageRole {
  Human,
  AI,
}

fn print_token(t: String) {
  print!("{t}");
  std::io::stdout().flush().unwrap();
}

fn inference_callback<'a>(
  stop_sequence: String,
  buf: &'a mut String,
  window: &'a tauri::Window,
) -> impl FnMut(llm::InferenceResponse) -> Result<llm::InferenceFeedback, Infallible>
     + 'a {
  move |resp| match resp {
    llm::InferenceResponse::InferredToken(t) => {
      let mut reverse_buf = buf.clone();
      reverse_buf.push_str(t.as_str());
      if stop_sequence.as_str().eq(reverse_buf.as_str()) {
        buf.clear();
        return Ok(llm::InferenceFeedback::Halt);
      } else if stop_sequence.as_str().starts_with(reverse_buf.as_str()) {
        buf.push_str(t.as_str());
        return Ok(llm::InferenceFeedback::Continue);
      }

      if buf.is_empty() {
        //println!("buf empty\n");
        print_token(t.clone());
        window.emit("NEW_TOKEN", Payload { message: t }).unwrap();
        Ok(llm::InferenceFeedback::Continue)
      } else {
        //println!("reverse buf\n");
        print_token(reverse_buf);
        Ok(llm::InferenceFeedback::Continue)
      }
    }
    llm::InferenceResponse::EotToken => Ok(llm::InferenceFeedback::Halt),
    _ => Ok(llm::InferenceFeedback::Continue),
  }
}

#[tauri::command]
pub fn set_current_model(app_handle: tauri::AppHandle) -> Result<(), String> {
  // load a GGML model from disk
  let model_path =
    PathBuf::from_str("./download/orca-mini-13b.ggmlv3.q4_0.bin").unwrap();
  let model_architecture = String::from_str("llama").unwrap();
  match load_model(&model_path, &model_architecture) {
    Ok(model) => {
      let app_state = app_handle.state::<AppState>();
      app_state.model.lock().unwrap().replace(model);
      Ok(())
    }
    Err(err) => {
      return Err(err.to_string());
    }
  }
}

pub fn load_model(
  model_path: &PathBuf,
  architecture: &str,
) -> Result<Box<dyn llm::Model>, LoadError> {
  println!("Loading model:");
  println!("- Path: {}", model_path.display());
  println!("- Architecture: {}", architecture);

  let model = llm::load_dynamic(
    architecture.parse().unwrap_or_else(|e| panic!("{e}")),
    model_path,
    llm::VocabularySource::Model,
    Default::default(),
    llm::load_progress_callback_stdout,
  );
  match model {
    Ok(model) => {
      println!("Model loaded!");
      return Ok(model);
    }
    Err(err) => {
      println!("Error loading model: {}", err);
      return Err(err);
    }
  }
}

fn start_inference(
  app_handle: &tauri::AppHandle,
  model: &Box<dyn llm::Model>,
  prompt: String,
  mut inference_token_callback: impl FnMut(
    String,
  )
    -> Result<InferenceFeedback, Infallible>,
  window: &tauri::Window,
) -> Result<InferenceStats, InferenceError> {
  let mut session = model.start_session(Default::default());

  let inference_parameters = llm::InferenceParameters::default();
  let mut rng = rand::thread_rng();
  println!("\n start feed prompt {} \n", &prompt);
  let _ = session.feed_prompt(
    model.as_ref(),
    &inference_parameters,
    &prompt,
    &mut Default::default(),
    llm::feed_prompt_callback(|resp| match resp {
      llm::InferenceResponse::PromptToken(_) => {
        Ok::<InferenceFeedback, Infallible>(llm::InferenceFeedback::Continue)
      }
      llm::InferenceResponse::InferredToken(t) => {
        //print_token(&t);
        println!("infer token {}", &t);
        return inference_token_callback(t);
        //Ok(llm::InferenceFeedback::Continue)
      }
      _ => Ok(llm::InferenceFeedback::Continue),
    }),
  );
  //.expect("Failed to ingest initial prompt.");

  let character_name = "### Assistant";
  let user_name = "### Human";
  let mut buf = String::new();
  let mut res = llm::InferenceStats::default();
  let new_prompt = format!("{user_name}: {prompt}\n{character_name}:");
  println!("start infer on {}\n", &new_prompt);
  let stats = session
    .infer(
      model.as_ref(),
      &mut rng,
      &llm::InferenceRequest {
        prompt: new_prompt.as_str().into(),
        parameters: &inference_parameters,
        play_back_previous_tokens: false,
        maximum_token_count: None,
      },
      &mut Default::default(),
      inference_callback(String::from(user_name), &mut buf, window),
    )
    .unwrap_or_else(|e| panic!("{e}"));
  res.feed_prompt_duration = res
    .feed_prompt_duration
    .saturating_add(stats.feed_prompt_duration);
  res.prompt_tokens += stats.prompt_tokens;
  res.predict_duration =
    res.predict_duration.saturating_add(stats.predict_duration);
  res.predict_tokens += stats.predict_tokens;
  return Ok(stats);
}

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}
#[tauri::command]
pub async fn chat(
  message: String,
  app_handle: tauri::AppHandle,
  window: tauri::Window,
) -> String {
  let app_state = app_handle.state::<AppState>();
  let chat_state = app_handle.state::<ChatState>();

  match app_state.inner().model.lock().unwrap().as_ref() {
    Some(model) => {
      // use the model to generate text from a prompt
      let mut messages = chat_state.inner().messages.lock().unwrap();
      messages.push(Message {
        text: message.clone(),
        role: MessageRole::Human,
      });

      let character_name = "### Assistant";
      let user_name = "### Human";
      let persona = "A chat between a human and an assistant.";
      let history = format!(
        "{character_name}: Hello - How may I help you today?\n\
                {user_name}: What is the capital of France?\n\
                {character_name}:  Paris is the capital of France."
      );
      let prompt = format!("{persona}\n{history}\n{user_name}:{message}");
      print!("prompt: {}", prompt);
      let mut answer = "".to_string();
      let res = start_inference(
        &app_handle,
        &model,
        prompt,
        |token| {
          answer.push_str(&token);
          window
            .emit(
              "NEW_TOKEN",
              Payload {
                message: token.to_string(),
              },
            )
            .unwrap();
          Ok(InferenceFeedback::Continue)
        },
        &window,
      );

      match res {
        Ok(stats) => println!("\n\nInference stats:\n{stats}"),
        Err(e) => println!("Inference Error!"),
      }

      //let mut rl = rustyline::DefaultEditor::new().expect("Failed to create input reader");

      // let mut rng = rand::thread_rng();
      // let mut buf = String::new();

      //loop {
      // println!();
      // let readline = rl.readline(format!("{user_name}: ").as_str());
      // println!("{user_name}: {message}\n{character_name}:");
      // print!("{character_name}:");

      // // match message {
      // //     Ok(line) => {
      // let stats = session
      //     .infer(
      //         model.as_ref(),
      //         &mut rng,
      //         &llm::InferenceRequest {
      //             prompt: format!("{user_name}: {message}\n{character_name}:")
      //                 .as_str()
      //                 .into(),
      //             parameters: &inference_parameters,
      //             play_back_previous_tokens: false,
      //             maximum_token_count: None,
      //         },
      //         &mut Default::default(),
      //         inference_callback(String::from(user_name), &mut buf),
      //     )
      //     .unwrap_or_else(|e| panic!("{e}"));
      // let mut res = llm::InferenceStats::default();
      // res.feed_prompt_duration = res
      //     .feed_prompt_duration
      //     .saturating_add(stats.feed_prompt_duration);
      // res.prompt_tokens += stats.prompt_tokens;
      // res.predict_duration = res.predict_duration.saturating_add(stats.predict_duration);
      // res.predict_tokens += stats.predict_tokens;
      //     }
      //     Err(ReadlineError::Eof) | Err(ReadlineError::Interrupted) => {
      //         break;
      //     }
      //     Err(err) => {
      //         println!("{err}");
      //     }
      //  }
      //}
    }
    None => {
      println!("No model loaded");
      return "Error: No model loaded".to_string();
    }
  };
  //println!("\n\nInference stats:\n{res}");
  //return String("Hello");
  return String::new();
}
