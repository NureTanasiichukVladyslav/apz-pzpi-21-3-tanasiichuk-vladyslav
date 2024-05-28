import { getUser } from "@/services/getUser";
import { AnimalDto } from "@/types";
import { fetchClient } from "@/utils/fetch";
import {
  Card,
  Container,
  Stack,
  Typography,
  Link,
  Button,
} from "@mui/material";
import React from "react";

async function getData() {
  return fetchClient.get<AnimalDto[]>("/animals");
}

export default async function Home() {
  const [animal, accountDetails] = await Promise.all([getData(), getUser()]);

  if (!animal) {
    return null;
  }

  console.log(animal);

  return (
    <main>
      <Container maxWidth="xl">
        <Stack gap={4}>
          <Typography variant="h3">All animals</Typography>
          <Stack gap={2}>
            {animal && animal.length > 0 ? (
              animal.map((animal) => (
                <Card key={animal.id} sx={{ padding: "0.75rem 1.25rem" }}>
                  <Stack gap={2}>
                    <Link
                      href={`/animals/${animal.id}`}
                      variant="body1"
                      underline="hover"
                    >
                      {animal.name}
                    </Link>
                    <Typography>{animal.dateOfBirth}</Typography>
                    <Typography>Species: {animal.species.name}</Typography>
                  </Stack>
                </Card>
              ))
            ) : (
              <Typography>No animals found</Typography>
            )}
          </Stack>
        </Stack>
      </Container>
    </main>
  );
}
