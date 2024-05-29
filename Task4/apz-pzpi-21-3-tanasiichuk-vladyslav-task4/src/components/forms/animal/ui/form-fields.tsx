"use client";
import {
  AnimalDto,
  AnimalSpeciesDto,
  CreateEditAnimalDto,
  UserDto,
} from "@/types";
import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  animalSpecies: AnimalSpeciesDto[];
  onSubmit: (value: Omit<CreateEditAnimalDto, "userId">) => void;
  animal?: AnimalDto;
}

export function FormFields({ animalSpecies, onSubmit, animal }: Props) {
  const router = useRouter();

  const { t } = useTranslation();

  const [name, setName] = useState(animal?.name ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    animal?.dateOfBirth.split("T")[0] ?? ""
  );
  const [gender, setGender] = useState(animal?.gender ?? "male");
  const [weight, setWeight] = useState(animal?.weight ?? 0);
  const [speciesId, setSpeciesId] = useState(
    animal?.species.id ?? animalSpecies[0]?.id
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await onSubmit({ name, dateOfBirth, gender, weight, speciesId });
      await router.push("/");
    } catch (err) {
      setErrorMessage(t("errorMessage"));
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
          label={t("name")}
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!errorMessage}
        />
        <TextField
          variant="outlined"
          required
          fullWidth
          id="dateOfBirth"
          label={t("dateOfBirth")}
          name="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!!errorMessage}
        />
        <Select
          variant="outlined"
          required
          fullWidth
          id="gender"
          label={t("gender")}
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          error={!!errorMessage}
        >
          <MenuItem value="male">{t("male")}</MenuItem>
          <MenuItem value="female">{t("female")}</MenuItem>
        </Select>
        <TextField
          variant="outlined"
          required
          fullWidth
          id="weight"
          label={t("weight")}
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          error={!!errorMessage}
        />
        <Select
          variant="outlined"
          required
          fullWidth
          id="speciesId"
          label={t("species")}
          name="speciesId"
          value={speciesId}
          onChange={(e) => setSpeciesId(Number(e.target.value))}
          error={!!errorMessage}
        >
          {animalSpecies.map((species) => (
            <MenuItem key={species.id} value={species.id}>
              {species.name}
            </MenuItem>
          ))}
        </Select>
        <Button type="submit" fullWidth variant="contained" color="primary">
          {animal ? t("edit") : t("add")}
        </Button>
      </Stack>
      {errorMessage && (
        <Typography variant="body2" color="error">
          {t("errorMessage")}
        </Typography>
      )}
    </form>
  );
}
