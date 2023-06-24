// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod download;
mod llm_backend;
use std::{path::PathBuf, sync::Mutex, vec};
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
    .invoke_handler(
      tauri::generate_handler![
        greet,
        download::download_file, 
        llm_backend::chat
      ]
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
