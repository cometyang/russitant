use std::cmp::min;
use std::fs::{File, OpenOptions};
use std::io::{Seek, Write};
use reqwest::Client;
//use indicatif::{ProgressBar, ProgressStyle};
use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use tokio::time::Instant;
use tauri::{self, Window};


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Progress {
    //pub download_id: i64,
    pub filesize: u64,
    pub transfered: u64,
    pub transfer_rate: f64,
    pub percentage: f64,
}
const UPDATE_SPEED:u128=50;

impl Progress {
    pub fn emit_progress(&self, handle: &Window) {
        handle.emit("DOWNLOAD_PROGRESS", &self).ok();
    }

    pub fn emit_finished(&self, handle: &Window) {
        handle.emit("DOWNLOAD_PROGRESS", &self).ok();
    }
}

#[tauri::command]
pub async fn download_file(url: String, path: String, window: Window) -> Result<(), String> {
    let client=Client::new();
    let start_time = Instant::now();
    let mut last_update= std::time::Instant::now();
    let res = client
        .get(&url)
        .send()
        .await
        .or(Err(format!("Failed to GET from '{}'", &url)))?;
    let total_size = res
        .content_length()
        .ok_or(format!("Failed to get content length from '{}'", &url))?;

    // let pb = ProgressBar::new(total_size);
    // pb.set_style(ProgressStyle::default_bar()
    //     .template("{msg}\n{spinner:.green} [{elapsed_precise}] [{wide_bar:.white/blue}] {bytes}/{total_bytes} ({bytes_per_sec}, {eta})")
    //     .unwrap()
    //     .progress_chars("█  "));
    
    // pb.set_message(format!("Downloading {}", url));




    let mut file;
    let mut downloaded: u64 = 0;
    let mut stream = res.bytes_stream();
    
    println!("Seeking in file.");
    if std::path::Path::new(&path).exists() {
        println!("File exists. Resuming.");
        file = std::fs::OpenOptions::new()
            .read(true)
            .append(true)
            .open(&path)
            .unwrap();

        let file_size = std::fs::metadata(&path).unwrap().len();
        file.seek(std::io::SeekFrom::Start(file_size)).unwrap();
        downloaded = file_size;

    } else {
        println!("Fresh file..{}",&path);
        file = File::create(&path).or(Err(format!("Failed to create file '{}'", path)))?;
    }

    let mut progress = Progress {
        //download_id: 0,
        filesize: downloaded,
        transfered: 0,
        transfer_rate: 0.0,
        percentage: 0.0,
    };
    println!("Commencing transfer");
    while let Some(item) = stream.next().await {
        let chunk = item.or(Err(format!("Error while downloading file")))?;
        file.write(&chunk)
            .or(Err(format!("Error while writing to file")))?;
        let new = min(downloaded + (chunk.len() as u64), total_size);
        downloaded = new;
        let downloaded_bytes=downloaded;
        let duration = start_time.elapsed().as_secs_f64();
        progress.transfered = downloaded_bytes;
        println!("Progress transferred: {},pct: {}",progress.transfered, progress.percentage);
        progress.percentage = (progress.transfered * 100 / total_size) as f64;
        progress.transfer_rate = (downloaded_bytes as f64) / ((start_time.elapsed().as_secs() as f64)
            + (start_time.elapsed().subsec_nanos() as f64 / 1_000_000_000.0).trunc());

        // This is so I don't emit the event everytime. I do it every 50ms (UPDATE_SPEED).
        if last_update.elapsed().as_millis() >= UPDATE_SPEED {
            println!("Transferred {}",progress.percentage);
            progress.emit_progress(&window);
            last_update = std::time::Instant::now();
        }
        //pb.set_position(new);
    }
    println!("Finished Downloading, Pct: {}", progress.percentage );
    //pb.finish_with_message(format!("Downloaded {} to {}", url, path));
    progress.emit_finished(&window);

    return Ok(());
}