"use client";
import { CreateEditAnimalSpeciesDto } from "@/types";
import { fetchClient } from "@/utils/fetch";
import { Stack, Typography } from "@mui/material";
import { FormFields } from "./ui";

export function CreateAnimalSpeciesForm() {
  const createAnimalSpecies = async ({
    name,
    maxHeartbeat,
    minHeartbeat,
    maxRespirationRate,
    minRespirationRate,
    maxTemperature,
    minTemperature,
  }: CreateEditAnimalSpeciesDto) => {
    fetchClient.post(`animal-species`, {
      name,
      maxHeartbeat,
      minHeartbeat,
      maxRespirationRate,
      minRespirationRate,
      maxTemperature,
      minTemperature,
    });
  };

  return (
    <Stack gap={4}>
      <Typography variant="h5" align="center">
        Create new animal species
      </Typography>
      <FormFields onSubmit={createAnimalSpecies} />
    </Stack>
  );
}
