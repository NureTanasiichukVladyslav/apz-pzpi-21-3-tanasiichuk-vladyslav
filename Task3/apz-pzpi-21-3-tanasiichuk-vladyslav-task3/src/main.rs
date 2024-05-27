use rand::Rng;
use serde::{Serialize};
use std::time::Duration;
use task_3_lib::{get_settings, get_device_data};
use task_3_lib::device_data::device_data::DeviceData;
use task_3_lib::settings::settings::Settings;
use tokio::time::interval;
use tokio::select;

#[derive(Debug, Serialize)]
#[allow(non_snake_case)]
struct RequestPayload {
  deviceId: u64,
  respirationRate: f64,
  temperature: f64,
  heartbeat: f64,
  timestamp: String,
  animalId: u64,
}

#[tokio::main]
async fn main() {
    let settings = get_settings().unwrap();
    let device_data = get_device_data().await.unwrap();

    let mut data_buffer: Vec<RequestPayload> = Vec::new();

    let mut rng = rand::thread_rng();

    let mut data_stream = interval(Duration::from_secs(settings.data_taking_rate));
    let mut send_stream = interval(Duration::from_secs(settings.data_sending_rate));

    loop {
        select! {
            _ = send_stream.tick() => {
                if !data_buffer.is_empty() {
                    send_batch_data(&data_buffer).await.unwrap();
                    data_buffer.clear();
                }
            },
            _ = data_stream.tick() => {
                let payload = generate_payload(&device_data, &settings, &mut rng);

                // Check for critical values
                if is_critical(&payload, &device_data) {
                    send_critical_data(payload).await.unwrap();
                } else {
                    data_buffer.push(payload);
                }
            },
        }
    }
}

// Function to check if a reading is critical
fn is_critical(payload: &RequestPayload, device_data: &DeviceData) -> bool {
  payload.respirationRate < (device_data.min_respiration_rate as f64) ||
  payload.respirationRate > (device_data.max_respiration_rate as f64) ||
  payload.temperature < (device_data.min_temperature as f64) ||
  payload.temperature > (device_data.max_temperature as f64) ||
  payload.heartbeat < (device_data.min_heartbeat as f64) ||
  payload.heartbeat > (device_data.max_heartbeat as f64)
}

fn generate_payload(device_data: &DeviceData, settings:&Settings, rng: &mut impl Rng) -> RequestPayload {
    let critical_threshold = 1.05;
  
    let respiration_rate = rng.gen_range(
      (device_data.min_respiration_rate as f64)/critical_threshold..(device_data.max_respiration_rate as f64)*critical_threshold
    );
  
    let temperature = rng.gen_range(
        (device_data.min_temperature as f64)/critical_threshold..(device_data.max_temperature as f64)*critical_threshold
    );
  
    let heartbeat = rng.gen_range(
     (device_data.min_heartbeat as f64)/critical_threshold..(device_data.max_heartbeat as f64)*critical_threshold
    );
  
    let timestamp = chrono::Utc::now().to_rfc3339();
  
    RequestPayload {
      deviceId: device_data.device_id,
      respirationRate:respiration_rate,
      temperature,
      heartbeat,
      timestamp,
      animalId: settings.animal_id,
    }
  }

// Function to send a single data point
async fn send_critical_data(payload: RequestPayload) -> Result<reqwest::Response, reqwest::Error> {
  let mut critical_data: Vec<RequestPayload> = Vec::new();
  critical_data.push(payload);
  let client = reqwest::Client::new();
  let res = client
    .post("http://localhost:3000/metric")
    .json(&critical_data)
    .send()
    .await?;

  println!("Sent critical sensor data: {:?}", serde_json::to_string(&res.status().as_str()).unwrap());
  Ok(res)
}

// Function to send a batch of data points
async fn send_batch_data(data: &[RequestPayload]) -> Result<reqwest::Response, reqwest::Error> {
  let client = reqwest::Client::new();
  let res = client
    .post("http://localhost:3000/metric")
    .json(&data)
    .send()
    .await?;

  println!("Sent batch of sensor data: {:?}", serde_json::to_string(&res.status().as_str()).unwrap());
  Ok(res)
}