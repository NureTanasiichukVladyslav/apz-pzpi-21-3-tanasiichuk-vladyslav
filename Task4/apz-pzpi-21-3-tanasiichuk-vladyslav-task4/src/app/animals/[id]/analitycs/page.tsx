import { getAnalitycs } from "@/services/get-analitycs";
import { getAnimal } from "@/services/get-animal";
import { getAnimalSpeciesById } from "@/services/get-animal-species-by-id";
import { Container, Stack, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts";

export default async function Page({
  params: { id },
}: {
  params: { id: number };
}) {
  const animal = await getAnimal(id);

  if (!animal) {
    return null;
  }

  const [analitycs, animalSpecies] = await Promise.all([
    getAnalitycs(id),
    getAnimalSpeciesById(animal.species.id),
  ]);

  return (
    <Container maxWidth="lg">
      <Stack gap={2}>
        <Typography variant="h4">{animal.name}</Typography>
        {analitycs && (
          <Stack direction="row" gap={2} alignItems="center" mt={2}>
            <Typography variant="body1">
              Status:{" "}
              <strong style={{ textTransform: "capitalize" }}>
                {analitycs.status}
              </strong>
            </Typography>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
