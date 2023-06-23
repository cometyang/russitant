use std::io::Write;
use llm::Model;


#[tauri::command]
pub async fn chat(message: String, app_handle: tauri::AppHandle, window: tauri::Window) -> String {

// load a GGML model from disk
let llama = llm::load::<llm::models::Llama>(
    // path to GGML file
    std::path::Path::new("./download/wizardLM-7B.ggml.q4_0.bin"),
    // llm::ModelParameters
    Default::default(),
    // load progress callback
    llm::load_progress_callback_stdout
)
.unwrap_or_else(|err| panic!("Failed to load model: {err}"));

// use the model to generate text from a prompt
let mut session = llama.start_session(Default::default());
let res = session.infer::<std::convert::Infallible>(
    // model to use for text generation
    &llama,
    // randomness provider
    &mut rand::thread_rng(),
    // the prompt to use for text generation, as well as other
    // inference parameters
    &llm::InferenceRequest {
        prompt: "Rust is a cool programming language because",
        ..Default::default()
    },
    // llm::OutputRequest
    &mut Default::default(),
    // output callback
    |t| {
        print!("{t}");
        std::io::stdout().flush().unwrap();

        Ok(())
    }
);

match res {
    Ok(result) => format!("\n\nInference stats:\n{result}"),
    Err(err) => format!("\n{err}"),
}

}
