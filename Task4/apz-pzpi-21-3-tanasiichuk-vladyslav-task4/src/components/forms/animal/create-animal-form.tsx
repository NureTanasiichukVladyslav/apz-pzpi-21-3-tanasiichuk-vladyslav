"use client";
import { AnimalSpeciesDto, CreateEditAnimalDto, UserDto } from "@/types";
import { fetchClient } from "@/utils/fetch";
import { Stack, Typography } from "@mui/material";
import { FormFields } from "./ui";

interface Props {
  user: UserDto;
  animalSpecies: AnimalSpeciesDto[];
  animalId?: number;
}

export function CreateAnimalForm({ user, animalSpecies }: Props) {
  const createAnimal = async ({
    name,
    dateOfBirth,
    gender,
    weight,
    speciesId,
  }: Omit<CreateEditAnimalDto, "userId">) => {
    fetchClient.post("animals", {
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
        Create new animal
      </Typography>
      <FormFields animalSpecies={animalSpecies} onSubmit={createAnimal} />
    </Stack>
  );
}
