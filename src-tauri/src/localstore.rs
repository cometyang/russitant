use serde_json::json;
use tauri_plugin_store::{Store, StoreBuilder};

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct CurrentLanguageModel {
    pub name: String,
    pub filename: String,
    pub architecture: String,
    pub path: String,
}

fn do_first_time(store: &mut Store<tauri::Wry>, app_handle: &tauri::AppHandle) {
    if let None = store.get("first_time") {
        let download_path = app_handle
            .path_resolver()
            .app_data_dir()
            .unwrap()
            .join("models");

        store
            .insert(
                "models_folder".to_string(),
                json!(download_path.to_string_lossy()),
            )
            .unwrap();
        store
            .insert("first_time".to_string(), json!(false))
            .unwrap();
        store.save().unwrap();
    }
}

fn load_store(app_handle: tauri::AppHandle) -> Store<tauri::Wry> {
    let mut store = StoreBuilder::new(app_handle.clone(), "store.bin".parse().unwrap()).build();
    match store.load() {
        Ok(_) => {
            println!("Store loaded");
        }
        Err(err) => {
            do_first_time(&mut store, &app_handle);
            println!("Store file not found: {}", err);
        }
    }
    return store;
}

pub(crate) fn save_current_model(
    app_handle: tauri::AppHandle,
    model: CurrentLanguageModel,
) -> Result<(), String> {
    let mut store = load_store(app_handle);
    store
        .insert("current_language_model".to_string(), json!(model))
        .unwrap();
    store.save().unwrap();
    Ok(())
}

pub(crate) fn get_active_model(app_handle: tauri::AppHandle) -> Option<CurrentLanguageModel> {
    let store = load_store(app_handle);
    match store.get("current_language_model".to_string()) {
        Some(value) => return Some(serde_json::from_value(value.clone()).unwrap()),
        None => {
            println!("No current language model found");
            return None;
        }
    }
}
