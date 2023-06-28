// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod download;
mod llm_backend;
mod localstore;
use std::{path::PathBuf, sync::Mutex, vec, str::FromStr};

use llm_backend::{set_current_model, load_model};
use localstore::CurrentLanguageModel;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {} from Rust!", name)
}

struct AppState {
  model: Mutex<Option<Box<dyn llm::Model>>>,
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .setup(|app| {
     
    let app_handle = app.app_handle();
    let model_config = CurrentLanguageModel {
      name: "llama".to_string(),
      filename: "orca-mini-13b.ggmlv3.q4_0.bin".to_string(),
      architecture: "llama".to_string(),
      path: "./download/orca-mini-13b.ggmlv3.q4_0.bin".to_string()
    };
    localstore::save_current_model(app_handle.clone(), model_config);
    let model: Option<Box<dyn llm::Model>>= match localstore::get_active_model(app_handle) {
      Some(current_model) => {
        match llm_backend::load_model(
          &PathBuf::from(current_model.path), 
          &current_model.architecture) 
          {
            Ok(model) => {
              println!("Loaded model: {:?}", current_model.name);
              Some(model)
            }
            Err(e) => {
              println!("Error loading model: {:?}", e);
              None
            }
          }
      }
      None => {
        println!("No current model");
        None
      }
    };
    app.manage(AppState {
      model: Mutex::from(model),
    });
    app.manage(llm_backend::ChatState {
        messages: Mutex::from(vec![]),
    });
    //  let model_path = std::path::Path::new("./download/ggml-model-q4_0.bin");
    //  let model_architecture = llm::ModelArchitecture::from_str("llama").unwrap();
    //  let model = llm_backend::load_model(model_path, model_architecture);
    //   app.manage(AppState {
    //     model: Mutex::from(model),
    // });
    Ok(())
  
      // let model: Option<Box<dyn llm::Model>> = match localstore::get_active_model(app_handle)
      //       {
      //           Some(current_model) => {
      //               match language_model::load_model(
      //                   &PathBuf::from(current_model.path),
      //                   &current_model.arquitecture,
      //               ) {
      //                   Ok(model) => {
      //                       println!("Loaded model: {:?}", current_model.name);
      //                       Some(model)
      //                   }
      //                   Err(e) => {
      //                       println!("Error loading model: {:?}", e);
      //                       None
      //                   }
      //               }
      //           }
      //           None => {
      //               println!("No current model");
      //               None
      //           }
      //       };

      //       app.manage(AppState {
      //           model: Mutex::from(model),
      //       });
    })
    .invoke_handler(
      tauri::generate_handler![
        greet,
        download::download_file, 
        llm_backend::chat,
        llm_backend::set_current_model
      ]
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
