"use client";
import {
  AnimalDto,
  AnimalSpeciesDto,
  CreateEditAnimalDto,
  UserDto,
} from "@/types";
import { fetchClient } from "@/utils/fetch";
import { Stack, Typography } from "@mui/material";
import { FormFields } from "./ui";
import { useTranslation } from "react-i18next";

interface Props {
  user: UserDto;
  animalSpecies: AnimalSpeciesDto[];
  animal: AnimalDto;
}

export function EditAnimalForm({ user, animalSpecies, animal }: Props) {
  const { t } = useTranslation();

  const editAnimal = async ({
    name,
    dateOfBirth,
    gender,
    weight,
    speciesId,
  }: Omit<CreateEditAnimalDto, "userId">) => {
    fetchClient.put(`animals/${animal.id}`, {
      name,
      dateOfBirth: new Date(dateOfBirth).toISOString(),
      gender,
      weight,
      speciesId,
      userId: user.id,
    });
  };

  return (
    <Stack gap={4}>
      <Typography variant="h5" align="center">
        {t("edit")} {animal.name}
      </Typography>
      <FormFields
        animalSpecies={animalSpecies}
        onSubmit={editAnimal}
        animal={animal}
      />
    </Stack>
  );
}
