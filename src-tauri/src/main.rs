#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn read_dir(path: &str) -> Vec<String> {
    let mut result = Vec::new();
    for entry in fs::read_dir(path).
        expect("Failed to read directory") {
        let entry = entry.expect("Failed to read entry");
        let path = entry.path();
        let file_name = path.file_name().unwrap().to_str().unwrap().to_string();
        result.push(file_name);
    }
    result
}

#[tauri::command]
fn is_dir(path: &str) -> bool {
    let entry = fs::metadata(path).expect("Failed to read entry");
    let test = entry.is_dir();

    test
}

// read_file function that reads file contents
#[tauri::command]
fn read_file(path: &str) -> String {
    // read file to string with error handling and match
    let str = match fs::read_to_string(path) {
        Ok(str) => str,
        Err(_) => String::from("null"),
    };

    str
}

// write_file function that writes file contents
#[tauri::command]
fn write_file(path: &str, contents: &str) {
    fs::write(path, contents)
        .expect("Failed to write file");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, read_dir, is_dir, read_file, write_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
