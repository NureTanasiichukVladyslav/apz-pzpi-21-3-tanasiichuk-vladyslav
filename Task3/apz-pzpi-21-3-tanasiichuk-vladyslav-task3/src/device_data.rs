pub mod device_data {
    use serde::{Deserialize, Serialize};
    use std::fs::{self, File};
    use std::io::{BufReader, Write};
    use crate::settings::settings::{read_settings};

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct DeviceData {
        pub device_id: u64,
        pub shared_secret: String,
        pub max_heartbeat: u64,
        pub min_heartbeat: u64,
        pub max_respiration_rate: u64,
        pub min_respiration_rate: u64,
        pub max_temperature: u64,
        pub min_temperature: u64,
    }

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct RegisterRequestPayload {
        pub animalId: u64,
    }

    #[derive(Debug, Serialize, Deserialize, Clone)]
    #[allow(non_snake_case)]
    pub struct RegisterResponsePayload {
        pub id: u64,
        pub sharedSecret: String,
        pub maxHeartbeat: u64,
        pub minHeartbeat: u64,
        pub maxRespirationRate: u64,
        pub minRespirationRate: u64,
        pub maxTemperature: u64,
        pub minTemperature: u64,
    }

    pub async fn read_device_data() -> anyhow::Result<DeviceData> {
        check_device_data_file().await?;

        let file = File::open("device_data.json")?;
        let reader = BufReader::new(file);
        let device_data: DeviceData = serde_json::from_reader(reader)?;

        Ok(device_data)
    }

    fn write_device_data(device_data: &DeviceData) -> anyhow::Result<()> {
        let device_data_json = serde_json::to_string(device_data)?;

        let mut file = File::create("device_data.json")?;
        file.write_all(device_data_json.as_bytes())?;

        Ok(())
    }

    async fn check_device_data_file() -> anyhow::Result<()> {
        // Check if device_data file exists, if not, register new device
        if !fs::metadata("device_data.json").is_ok() {
            println!("Device data file does not exist. Creating a new one...");
            let device_data = register().await.unwrap();
            write_device_data(&device_data).unwrap();
        }
        Ok(())
    }

    pub async fn register() -> anyhow::Result<DeviceData> {
        let settings = read_settings()?;

        let payload = RegisterRequestPayload { animalId: settings.animal_id };

        let res: RegisterResponsePayload = reqwest::Client::new()
            .post("http://localhost:3000/device")
            .json(&payload)
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap();

        let response_data = DeviceData {
            device_id: res.id,
            shared_secret: res.sharedSecret,
            max_heartbeat: res.maxHeartbeat,
            min_heartbeat: res.minHeartbeat,
            max_respiration_rate: res.maxRespirationRate,
            min_respiration_rate: res.minRespirationRate,
            max_temperature: res.maxTemperature,
            min_temperature: res.minTemperature,
        };

        println!("Device succesfully registered");

        Ok(response_data)
    }
}
