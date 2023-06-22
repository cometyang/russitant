// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod download;
#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {} from Rust!", name)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet,download::download_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
