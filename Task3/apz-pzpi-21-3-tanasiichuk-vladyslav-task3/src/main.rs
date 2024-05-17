use rand::Rng;
use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::{self, BufReader, Write};
use std::thread;
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Settings {
    wifi_ssid: String,
    wifi_password: String,
    animal_id: u64,
    data_sending_rate: u64, // in seconds
}

#[derive(Debug, Serialize)]
#[allow(non_snake_case)]
struct RequestPayload {
    respirationRate: f64,
    temperature: f64,
    heartbeat: f64,
    timestamp: String,
    animalId: u64,
}

fn write_settings(settings: &Settings) -> io::Result<()> {
    let settings_json = serde_json::to_string(settings)?;

    let mut file = File::create("settings.json")?;
    file.write_all(settings_json.as_bytes())?;

    Ok(())
}

fn read_settings() -> io::Result<Settings> {
    let file = File::open("settings.json")?;
    let reader = BufReader::new(file);
    let settings: Settings = serde_json::from_reader(reader)?;

    Ok(settings)
}

#[tokio::main]
async fn main() {
    // Check if settings file exists, if not, prompt user to create it
    if !fs::metadata("settings.json").is_ok() {
        println!("Settings file does not exist. Creating a new one...");
        let default_settings = Settings {
            wifi_ssid: String::new(),
            wifi_password: String::new(),
            animal_id: 0,
            data_sending_rate: 5,
        };
        write_settings(&default_settings).expect("Failed to create settings file");
    }

    // Read settings from JSON file
    let settings = read_settings().expect("Failed to read settings file");

    println!("Current Settings:");
    println!("WiFi SSID: {}", settings.wifi_ssid);
    println!("WiFi Password: {}", settings.wifi_password);
    println!("Data Sending Rate: {} seconds", settings.data_sending_rate);

    let mut updated_settings = settings.clone();

    // Prompt user for WiFi credentials
    // Update settings with user input
    println!("Enter WiFi SSID:");
    let mut ssid = String::new();
    io::stdin()
        .read_line(&mut ssid)
        .expect("Failed to read line");

    if ssid.trim().is_empty() {
        updated_settings.wifi_ssid = settings.wifi_ssid;
    } else {
        updated_settings.wifi_ssid = ssid.trim().to_string();
    }

    println!("Enter WiFi password:");
    let mut password = String::new();
    io::stdin()
        .read_line(&mut password)
        .expect("Failed to read line");
    if ssid.trim().is_empty() {
        updated_settings.wifi_password = settings.wifi_password;
    } else {
        updated_settings.wifi_password = password.trim().to_string();
    }

    let mut animal_id_input = String::new();
    io::stdin()
        .read_line(&mut animal_id_input)
        .expect("Failed to read line");

    let mut animal_id: u64 = 0;
    loop {
        println!("Enter animal ID:");

        let mut animal_id_input = String::new();
        io::stdin()
            .read_line(&mut animal_id_input)
            .expect("Failed to read line");

        if animal_id_input.trim().is_empty() {
            if settings.animal_id == 0 {
                continue;
            }

            updated_settings.animal_id = settings.animal_id;
            break;
        }

        // Parse the input into a u64
        animal_id = animal_id_input
            .trim()
            .parse()
            .expect("Input not an integer.");

        if animal_id > 0 {
            updated_settings.animal_id = animal_id;
            break; // Exit the loop if the animal ID is valid
        } else {
            println!("Animal ID should be greater than 0. Please enter again.");
        }
    }

    let mut data_sending_rate: u64;
    loop {
        println!("Enter data sending rate:");

        let mut data_sending_rate_input = String::new();
        io::stdin()
            .read_line(&mut data_sending_rate_input)
            .expect("Failed to read line");

        if data_sending_rate_input.trim().is_empty() {
            updated_settings.data_sending_rate = settings.data_sending_rate;
            break;
        }

        // Parse the input into a u64
        data_sending_rate = data_sending_rate_input
            .trim()
            .parse()
            .expect("Input not an integer.");

        if data_sending_rate > 5 {
            updated_settings.data_sending_rate = data_sending_rate;

            break; // Exit the loop if the data_sending_rate is valid
        } else {
            println!("data_sending_rate should be greater than 5 seconds. Please enter again.");
        }
    }

    // Write updated settings to file
    write_settings(&updated_settings).expect("Failed to update settings file");

    println!("Settings updated successfully!");

    // Simulate sending sensor data
    let mut rng = rand::thread_rng();
    loop {
        let payload = RequestPayload {
            respirationRate: rng.gen_range(10.0..30.0),
            temperature: rng.gen_range(35.0..40.0),
            heartbeat: rng.gen_range(60.0..120.0),
            timestamp: chrono::Utc::now().to_rfc3339(),
            animalId: animal_id,
        };

        let res = reqwest::Client::new()
            .post("http://localhost:3000/metric")
            .json(&payload)
            .send()
            .await
            .unwrap();
        println!(
            "Sending sensor data: {:?}",
            serde_json::to_string(&res.status().as_str()).unwrap()
        );
        // Simulate delay based on data sending rate
        thread::sleep(Duration::from_secs(updated_settings.data_sending_rate));
    }
}
