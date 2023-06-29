#[derive(serde::Deserialize)]
struct ModelSettings {
    models: Vec<ModelSetting>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct ModelSetting {
    pub name: String,
    pub filename: String,
    pub architecture: String,
    pub url: String,
}

#[tauri::command]
pub async fn choose_directory(
    app: tauri::AppHandle,
    window: tauri::Window,
) -> Result<(), String> {
    // use tauri::api::dialog::blocking::FileDialogBuilder;

    // let dialog_result = FileDialogBuilder::new().pick_folder();

    // match dialog_result {
    //     Some(path) => {
    //         localstore::save_models_folder(app_handle, path.to_str().unwrap().to_string()).unwrap();
    //         return Ok(path.to_str().unwrap().to_string());
    //     }
    //     None => {
    //         return Err("No path selected".to_string());
    //     }
    // }

    Ok(())
}

//pub fn get_model_settings() -> Vec<ModelSetting> {}
