"use client";
import { CreateEditAnimalSpeciesDto } from "@/types";
import { Button, Slider, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  animalSpecies?: CreateEditAnimalSpeciesDto;
  onSubmit: (value: CreateEditAnimalSpeciesDto) => void;
}

export function FormFields({ animalSpecies, onSubmit }: Props) {
  const router = useRouter();
  const [name, setName] = useState(animalSpecies?.name ?? "");
  const [heartbeatRange, setHeartbeatRange] = useState<number[]>([
    animalSpecies?.minHeartbeat ?? 0,
    animalSpecies?.maxHeartbeat ?? 100,
  ]);
  const [respirationRateRange, setRespirationRateRange] = useState<number[]>([
    animalSpecies?.minRespirationRate ?? 0,
    animalSpecies?.maxRespirationRate ?? 100,
  ]);
  const [temperatureRange, setTemperatureRange] = useState<number[]>([
    animalSpecies?.minTemperature ?? 0,
    animalSpecies?.maxTemperature ?? 100,
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await onSubmit({
        name,
        minHeartbeat: heartbeatRange[0],
        maxHeartbeat: heartbeatRange[1],
        minRespirationRate: respirationRateRange[0],
        maxRespirationRate: respirationRateRange[1],
        minTemperature: temperatureRange[0],
        maxTemperature: temperatureRange[1],
      });
      await router.push("/animal-species");
    } catch (err) {
      setErrorMessage("Something went wrong. Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={2}>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errorMessage}
        />
        <Typography gutterBottom>Heartbeat Range</Typography>
        <Slider
          value={heartbeatRange}
          onChange={(e, newValue) => setHeartbeatRange(newValue as number[])}
          valueLabelDisplay="auto"
          aria-labelledby="heartbeat-range-slider"
          min={0}
          max={200}
        />
        <Typography gutterBottom>Respiration Rate Range</Typography>
        <Slider
          value={respirationRateRange}
          onChange={(e, newValue) =>
            setRespirationRateRange(newValue as number[])
          }
          valueLabelDisplay="auto"
          aria-labelledby="respiration-rate-range-slider"
          min={0}
          max={100}
        />
        <Typography gutterBottom>Temperature Range</Typography>
        <Slider
          value={temperatureRange}
          onChange={(e, newValue) => setTemperatureRange(newValue as number[])}
          valueLabelDisplay="auto"
          aria-labelledby="temperature-range-slider"
          min={0}
          max={50}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          {animalSpecies ? "Edit" : "Create"}
        </Button>
      </Stack>
      {errorMessage && (
        <Typography variant="body2" color="error">
          {errorMessage}
        </Typography>
      )}
    </form>
  );
}
