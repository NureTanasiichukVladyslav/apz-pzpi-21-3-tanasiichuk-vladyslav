"use client";
import { CreateEditAnimalSpeciesDto } from "@/types";
import { fetchClient } from "@/utils/fetch";
import { Stack, Typography } from "@mui/material";
import { FormFields } from "./ui";
import { useTranslation } from "react-i18next";

export function CreateAnimalSpeciesForm() {
  const { t } = useTranslation();

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
        {t("addAnimalSpecies")}
      </Typography>
      <FormFields onSubmit={createAnimalSpecies} />
    </Stack>
  );
}
