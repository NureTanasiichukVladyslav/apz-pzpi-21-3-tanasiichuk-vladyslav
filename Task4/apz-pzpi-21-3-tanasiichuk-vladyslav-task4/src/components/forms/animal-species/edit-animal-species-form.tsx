"use client";
import { AnimalSpeciesDto, CreateEditAnimalSpeciesDto } from "@/types";
import { fetchClient } from "@/utils/fetch";
import { Stack, Typography } from "@mui/material";
import { FormFields } from "./ui";
import { useTranslation } from "react-i18next";

interface Props {
  animalSpecies: AnimalSpeciesDto;
}

export function EditAnimalSpeciesForm({ animalSpecies }: Props) {
  const { t } = useTranslation();

  const editAnimalSpecies = async ({
    name,
    maxHeartbeat,
    minHeartbeat,
    maxRespirationRate,
    minRespirationRate,
    maxTemperature,
    minTemperature,
  }: CreateEditAnimalSpeciesDto) => {
    fetchClient.put(`animal-species/${animalSpecies.id}`, {
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
        {t("edit")} {animalSpecies.name}
      </Typography>
      <FormFields animalSpecies={animalSpecies} onSubmit={editAnimalSpecies} />
    </Stack>
  );
}
