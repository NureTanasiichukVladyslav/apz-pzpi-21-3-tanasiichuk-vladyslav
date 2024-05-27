pub mod settings {
    use serde::{Deserialize, Serialize};
    use std::fs::{self, File};
    use std::io::{self, BufReader, Write};

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct Settings {
        pub wifi_ssid: String,
        pub wifi_password: String,
        pub locale: String,
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

        let (current_settings, wifi_ssid, wifi_password, data_sending_rate, data_taking_rate) =
            if settings.locale == "ukr" {
                (
                    "Поточні налаштування:",
                    "SSID WiFi:",
                    "Пароль WiFi:",
                    "Частота відправлення даних:",
                    "Частота збирання даних:",
                )
            } else {
                (
                    "Current Settings:",
                    "WiFi SSID:",
                    "WiFi Password:",
                    "Data Sending Rate:",
                    "Data Taking Rate:",
                )
            };

        println!("{}", current_settings);
        println!("Locale: {}", settings.locale);
        println!("{} {}", wifi_ssid, settings.wifi_ssid);
        println!("{} {}", wifi_password, settings.wifi_password);
        println!(
            "{} {} seconds",
            data_sending_rate, settings.data_sending_rate
        );
        println!("{} {} seconds", data_taking_rate, settings.data_taking_rate);
        Ok(settings)
    }

    pub fn prompt_user_settings(settings: &Settings) -> io::Result<Settings> {
        let mut updated_settings = settings.clone();
        let mut device_id_input = String::new();
        io::stdin()
            .read_line(&mut device_id_input)
            .expect("Failed to read line");

        let mut locale = String::new();

        let prompt_locale = if updated_settings.locale == "ukr" {
            "Введіть мову (eng/ukr):"
        } else {
            "Enter locale (eng/ukr):"
        };

        println!("{}", prompt_locale);
        io::stdin()
            .read_line(&mut locale)
            .expect("Failed to read line");

        locale = locale.trim().to_string();
        if locale.is_empty() || !(locale == "eng" || locale == "ukr") {
            updated_settings.locale = settings.locale.clone();
        } else {
            updated_settings.locale = locale.clone();
        }

        let (
            prompt_wifi_ssid,
            prompt_wifi_password,
            prompt_animal_id,
            prompt_data_sending_rate,
            prompt_data_taking_rate,
            prompt_input_error,
            prompt_animal_id_error,
            prompt_data_sending_rate_error,
            prompt_data_taking_rate_error,
        ) = if updated_settings.locale == "ukr" || locale == "ukr" {
            (
                        "Введіть SSID WiFi:",
                        "Введіть пароль WiFi:",
                        "Введіть ID тварини:",
                        "Введіть частоту відправлення даних:",
                        "Введіть частоту збирання даних:",
                        "Невірний ввід. Будь ласка, спробуйте ще раз.",
                        "ID тварини повинно бути більше 0. Будь ласка, введіть ще раз.",
                        "Частота відправлення даних повинна бути більше 5 секунд. Будь ласка, введіть ще раз.",
                        "Частота збирання даних повинна бути більше 5 секунд. Будь ласка, введіть ще раз.",
                    )
        } else {
            (
                "Enter WiFi SSID:",
                "Enter WiFi password:",
                "Enter animal ID:",
                "Enter data sending rate:",
                "Enter data taking rate:",
                "Invalid input. Please try again.",
                "Animal ID should be greater than 0. Please enter again.",
                "Data sending rate should be greater than 5 seconds. Please enter again.",
                "Data taking rate should be greater than 5 seconds. Please enter again.",
            )
        };

        // Prompt user for WiFi credentials
        println!("{}", prompt_wifi_ssid);
        let mut ssid = String::new();
        io::stdin()
            .read_line(&mut ssid)
            .expect("Failed to read line");

        if ssid.trim().is_empty() {
            updated_settings.wifi_ssid = settings.wifi_ssid.clone();
        } else {
            updated_settings.wifi_ssid = ssid.trim().to_string();
        }

        println!("{}", prompt_wifi_password);
        let mut password = String::new();
        io::stdin()
            .read_line(&mut password)
            .expect("Failed to read line");
        if password.trim().is_empty() {
            updated_settings.wifi_password = settings.wifi_password.clone();
        } else {
            updated_settings.wifi_password = password.trim().to_string();
        }

        loop {
            println!("{}", prompt_animal_id);

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

            match animal_id_input.trim().parse::<u64>() {
                Ok(id) if id > 0 => {
                    updated_settings.animal_id = id;
                    break;
                }
                _ => println!("{}", prompt_animal_id_error),
            }
        }

        loop {
            println!("{}", prompt_data_sending_rate);

            let mut data_sending_rate_input = String::new();
            io::stdin()
                .read_line(&mut data_sending_rate_input)
                .expect("Failed to read line");

            if data_sending_rate_input.trim().is_empty() {
                updated_settings.data_sending_rate = settings.data_sending_rate;
                break;
            }

            match data_sending_rate_input.trim().parse::<u64>() {
                Ok(rate) if rate > 5 => {
                    updated_settings.data_sending_rate = rate;
                    break;
                }
                _ => println!("{}", prompt_data_sending_rate_error),
            }
        }

        loop {
            println!("{}", prompt_data_taking_rate);

            let mut data_taking_rate_input = String::new();
            io::stdin()
                .read_line(&mut data_taking_rate_input)
                .expect("Failed to read line");

            if data_taking_rate_input.trim().is_empty() {
                updated_settings.data_taking_rate = settings.data_taking_rate;
                break;
            }

            match data_taking_rate_input.trim().parse::<u64>() {
                Ok(rate) if rate > 5 => {
                    updated_settings.data_taking_rate = rate;
                    break;
                }
                _ => println!("{}", prompt_data_taking_rate_error),
            }
        }

        Ok(updated_settings)
    }

    pub fn write_user_settings(settings: &Settings) -> io::Result<()> {
        let updated_settings = prompt_user_settings(&settings)?;
        let print_settings_updated_succesfully = if updated_settings.locale == "ukr" {
            "Налаштування успішно змінено!"
        } else {
            "Settings updated successfully!"
        };

        write_settings(&updated_settings).expect("Failed to update settings file");
        println!("{}", print_settings_updated_succesfully);

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
                locale: "eng".to_string(),
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
