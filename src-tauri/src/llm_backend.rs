use crate::AppState;
use clap::Parser;
use llm::{models::Llama, Model, ModelArchitecture};
use rustyline::error::ReadlineError;
use std::{convert::Infallible, path::PathBuf};
use std::{io::Write, str::FromStr};
use tauri::Manager;
use tauri_plugin_store::{Store, StoreBuilder};

fn print_token(t: String) -> Result<llm::InferenceFeedback, Infallible> {
    print!("{t}");
    std::io::stdout().flush().unwrap();

    Ok(llm::InferenceFeedback::Continue)
}

fn inference_callback(
    stop_sequence: String,
    buf: &mut String,
) -> impl FnMut(llm::InferenceResponse) -> Result<llm::InferenceFeedback, Infallible> + '_ {
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
                print_token(t)
            } else {
                print_token(reverse_buf)
            }
        }
        llm::InferenceResponse::EotToken => Ok(llm::InferenceFeedback::Halt),
        _ => Ok(llm::InferenceFeedback::Continue),
    }
}

#[tauri::command]
pub fn set_active_model(app_handle: tauri::AppHandle) {
    // load a GGML model from disk
    let model_path = std::path::Path::new("./download/ggml-model-q4_0.bin");
    let model_architecture = llm::ModelArchitecture::from_str("llama").unwrap();
    let vocabulary_source = llm::VocabularySource::Model;
    let model = llm::load_dynamic(
        model_architecture,
        // path to GGML file
        &model_path,
        // llm::ModelParameters
        vocabulary_source,
        Default::default(),
        // load progress callback
        llm::load_progress_callback_stdout,
    )
    .unwrap_or_else(|err| panic!("Failed to load {model_architecture} from {model_path:?}: {err}"));

    let app_state = app_handle.state::<AppState>();
    app_state.model.lock().unwrap().replace(model);
}

#[tauri::command]
pub async fn chat(message: String, app_handle: tauri::AppHandle, window: tauri::Window) -> String {
    let app_state = app_handle.state::<AppState>();
    match app_state.inner().model.lock().unwrap().as_ref() {
        Some(model) => {
            // use the model to generate text from a prompt
            let mut session = model.start_session(Default::default());
            let character_name = "### Assistant";
            let user_name = "### Human";
            let persona = "A chat between a human and an assistant.";
            let history = format!(
                "{character_name}: Hello - How may I help you today?\n\
         {user_name}: What is the capital of France?\n\
         {character_name}:  Paris is the capital of France."
            );

            let inference_parameters = llm::InferenceParameters::default();

            session
                .feed_prompt(
                    model.as_ref(),
                    &inference_parameters,
                    format!("{persona}\n{history}").as_str(),
                    &mut Default::default(),
                    llm::feed_prompt_callback(|resp| match resp {
                        llm::InferenceResponse::PromptToken(t)
                        | llm::InferenceResponse::InferredToken(t) => print_token(t),
                        _ => Ok(llm::InferenceFeedback::Continue),
                    }),
                )
                .expect("Failed to ingest initial prompt.");
            //let mut rl = rustyline::DefaultEditor::new().expect("Failed to create input reader");

            let mut rng = rand::thread_rng();
            let mut buf = String::new();

            //loop {
            // println!();
            // let readline = rl.readline(format!("{user_name}: ").as_str());
            println!("{user_name}: {message}\n{character_name}:");
            print!("{character_name}:");

            // match message {
            //     Ok(line) => {
            let stats = session
                .infer(
                    model.as_ref(),
                    &mut rng,
                    &llm::InferenceRequest {
                        prompt: format!("{user_name}: {message}\n{character_name}:")
                            .as_str()
                            .into(),
                        parameters: &inference_parameters,
                        play_back_previous_tokens: false,
                        maximum_token_count: None,
                    },
                    &mut Default::default(),
                    inference_callback(String::from(user_name), &mut buf),
                )
                .unwrap_or_else(|e| panic!("{e}"));
            let mut res = llm::InferenceStats::default();
            res.feed_prompt_duration = res
                .feed_prompt_duration
                .saturating_add(stats.feed_prompt_duration);
            res.prompt_tokens += stats.prompt_tokens;
            res.predict_duration = res.predict_duration.saturating_add(stats.predict_duration);
            res.predict_tokens += stats.predict_tokens;
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
