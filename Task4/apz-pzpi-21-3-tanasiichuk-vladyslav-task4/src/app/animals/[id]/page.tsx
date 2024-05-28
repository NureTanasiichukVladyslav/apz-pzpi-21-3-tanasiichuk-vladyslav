import { getUser } from "@/services/getUser";
import { fetchClient } from "@/utils/fetch";
import {
  Card,
  Container,
  Stack,
  Typography,
  Button,
  Rating,
} from "@mui/material";

async function getData(id: number) {
  return fetchClient.get<{
    id: number;
    title: string;
    description: string;
    instructor: {
      id: number;
      login: string;
    };
    comments: { id: number; text: string; rating: number; createdAt: string }[];
    isEnrolled: boolean;
    isTracking: boolean;
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

  console.log(animal);

  return (
    <main>
      <Container maxWidth="xl">
        <Stack gap={4}>
          <Stack gap={2}>
            <Card key={animal.id} sx={{ padding: "0.75rem 1.25rem" }}>
              <Stack gap={2}>
                <Typography variant="h4">{animal.title}</Typography>
                <Typography>{animal.description}</Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {accountDetails &&
                    animal.instructor.id !== accountDetails?.id && (
                      <>
                        {!animal.isEnrolled && (
                          <Button
                            href={`/animals/${animal.id}/enroll`}
                            sx={{ width: "fit-content" }}
                          >
                            Enroll
                          </Button>
                        )}
                        {!animal.isTracking && (
                          <Button
                            href={`/animals/${animal.id}/track`}
                            sx={{ width: "fit-content" }}
                          >
                            Track
                          </Button>
                        )}
                        <Button
                          href={`/animals/${animal.id}/comment`}
                          sx={{ width: "fit-content" }}
                        >
                          Leave comment
                        </Button>
                      </>
                    )}
                </Stack>
              </Stack>
            </Card>
          </Stack>
          {animal.comments.length > 0 &&
            animal.comments.map((comment) => (
              <Card key={animal.id} sx={{ padding: "0.75rem 1.25rem" }}>
                <Stack gap={2} key={comment.id}>
                  <Rating size="medium" readOnly value={comment.rating} />
                  <Typography variant="body1">{comment.text}</Typography>
                  <Typography variant="body2">
                    {new Date(comment.createdAt).toDateString()}
                  </Typography>
                </Stack>
              </Card>
            ))}
        </Stack>
      </Container>
    </main>
  );
}
