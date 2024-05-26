pub mod settings {
    use serde::{Deserialize, Serialize};
    use std::fs::{self, File};
    use std::io::{self, BufReader, Write};

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct Settings {
        pub wifi_ssid: String,
        pub wifi_password: String,
        pub animal_id: u64,
        pub data_sending_rate: u64, // in seconds
        pub data_taking_rate: u64,  // in seconds
    }

    pub fn read_settings() -> io::Result<Settings> {
        check_settings_file();

        let file = File::open("settings.json")?;
        let reader = BufReader::new(file);
        let settings: Settings =
            serde_json::from_reader(reader).expect("Failed to read settings file");

        println!("Current Settings:");
        println!("WiFi SSID: {}", settings.wifi_ssid);
        println!("WiFi Password: {}", settings.wifi_password);
        println!("Data Sending Rate: {} seconds", settings.data_sending_rate);
        println!("Data Taking Rate: {} seconds", settings.data_taking_rate);

        Ok(settings)
    }

    pub fn prompt_user_settings(settings: &Settings) -> io::Result<Settings> {
        let mut updated_settings = settings.clone();
        let mut device_id_input = String::new();
        io::stdin()
            .read_line(&mut device_id_input)
            .expect("Failed to read line");

        // Prompt user for WiFi credentials
        println!("Enter WiFi SSID:");
        let mut ssid = String::new();
        io::stdin()
            .read_line(&mut ssid)
            .expect("Failed to read line");

        if ssid.trim().is_empty() {
            updated_settings.wifi_ssid = settings.wifi_ssid.clone();
        } else {
            updated_settings.wifi_ssid = ssid.trim().to_string();
        }

        println!("Enter WiFi password:");
        let mut password = String::new();
        io::stdin()
            .read_line(&mut password)
            .expect("Failed to read line");
        if ssid.trim().is_empty() {
            updated_settings.wifi_password = settings.wifi_password.clone();
        } else {
            updated_settings.wifi_password = password.trim().to_string();
        }

        #[warn(unused_assignments)]
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

        let mut data_taking_rate: u64;
        loop {
            println!("Enter data taking rate:");

            let mut data_taking_rate_input = String::new();
            io::stdin()
                .read_line(&mut data_taking_rate_input)
                .expect("Failed to read line");

            if data_taking_rate_input.trim().is_empty() {
                updated_settings.data_taking_rate = settings.data_taking_rate;
                break;
            }

            // Parse the input into a u64
            data_taking_rate = data_taking_rate_input
                .trim()
                .parse()
                .expect("Input not an integer.");

            if data_taking_rate > 5 {
                updated_settings.data_taking_rate = data_taking_rate;

                break; // Exit the loop if the data_taking_rate is valid
            } else {
                println!("data_taking_rate should be greater than 5 seconds. Please enter again.");
            }
        }

        Ok(updated_settings)
    }

    pub fn write_user_settings(settings: &Settings) -> io::Result<()> {
        let updated_settings = prompt_user_settings(&settings)?;

        write_settings(&updated_settings).expect("Failed to update settings file");
        println!("Settings updated successfully!");

        Ok(())
    }

    fn write_settings(settings: &Settings) -> io::Result<()> {
        let settings_json = serde_json::to_string(settings)?;

        let mut file = File::create("settings.json")?;
        file.write_all(settings_json.as_bytes())?;

        Ok(())
    }

    fn check_settings_file() {
        // Check if settings file exists, if not, prompt user to create it
        if !fs::metadata("settings.json").is_ok() {
            println!("Settings file does not exist. Creating a new one...");
            let default_settings = Settings {
                wifi_ssid: String::new(),
                wifi_password: String::new(),
                animal_id: 0,
                data_sending_rate: 30,
                data_taking_rate: 5,
            };
            write_settings(&default_settings).expect("Failed to create settings file");
        }
    }
}
