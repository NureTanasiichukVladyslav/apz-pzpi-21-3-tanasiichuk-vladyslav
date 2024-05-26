pub mod device_data;
pub mod settings;
use device_data::device_data::{read_device_data, DeviceData};
use settings::settings::{read_settings, write_user_settings, Settings};

pub fn get_settings() -> Result<Settings, std::io::Error> {
    let settings = read_settings()?;
    write_user_settings(&settings)?;
    Ok(settings)
}

pub async fn get_device_data() -> anyhow::Result<DeviceData> {
    let device_data = read_device_data().await?;
    Ok(device_data)
}

