import { getUser } from "@/services/getUser";
import { fetchClient } from "@/utils/fetch";
import { Card, Container, Stack, Typography } from "@mui/material";
import { EnrollButton } from "./enroll-button";

async function getData(id: number) {
  return fetchClient.get<{
    id: number;
    title: string;
    description: string;
    instructor: {
      id: number;
      login: string;
    };
    isEnrolled: boolean;
  }>(`/animals/${id}`);
}

export default async function Page({
  params: { id },
}: {
  params: { id: number };
}) {
  const [animal, accountDetails] = await Promise.all([getData(id), getUser()]);

  if (!animal) {
    return null;
  }

  return (
    <main>
      <Container maxWidth="xl">
        <Stack gap={4}>
          <Stack gap={2}>
            <Card key={animal.id} sx={{ padding: "0.75rem 1.25rem" }}>
              <Stack gap={2}>
                <Typography variant="h4">{animal.title}</Typography>
                <Typography>{animal.description}</Typography>
                {accountDetails?.id &&
                  animal.instructor.id !== accountDetails?.id && (
                    <EnrollButton
                      animalId={animal.id}
                      instructorId={animal.instructor.id}
                      userId={accountDetails.id}
                    />
                  )}
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </Container>
    </main>
  );
}
