import EditIcon from "@mui/icons-material/Edit";
import { DeleteButton } from "@/components";
import { AnalitycsDto, AnimalDto, MetricDto } from "@/types";
import { fetchClient } from "@/utils/fetch";
import { formatDate } from "@/utils/format-date";
import {
  Container,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

async function getAnimalData(id: number) {
  return fetchClient.get<AnimalDto>(`animals/${id}`);
}

async function getAnimalMetricsData(id: number) {
  return fetchClient.get<MetricDto[]>(`animals/${id}/metrics`);
}

async function getAnimalMetricsAnalitycs(id: number) {
  return fetchClient.post<AnalitycsDto>(`analitycs/${id}`);
}

export default async function Page({
  params: { id },
}: {
  params: { id: number };
}) {
  const [animal, animalMetrics, analitycs] = await Promise.all([
    getAnimalData(id),
    getAnimalMetricsData(id),
    getAnimalMetricsAnalitycs(id),
  ]);

  if (!animal) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack gap={2}>
            <Typography variant="h4">{animal.name}</Typography>
            <Typography>Species: {animal.species.name}</Typography>
            <Typography>
              Date of birth: {formatDate(animal.dateOfBirth)}
            </Typography>
            {animalMetrics && (
              <Stack gap={2}>
                <Typography variant="body1" fontWeight="600">
                  Last metrics:
                </Typography>
                <Stack direction="row">
                  <Typography>
                    Heartbeat: <strong>{animalMetrics[0].heartbeat}</strong>
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography>
                    Respiration rate:{" "}
                    <strong>{animalMetrics[0].respirationRate}</strong>
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography>
                    Temperature :{" "}
                    <strong>{animalMetrics[0].temperature}</strong>
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography>
                    Was taken at:{" "}
                    <strong>{formatDate(animalMetrics[0].timestamp)}</strong>
                  </Typography>
                </Stack>
              </Stack>
            )}
            {analitycs && (
              <Stack direction="row" gap={2} alignItems="center" mt={2}>
                <Typography variant="body1">
                  Status:{" "}
                  <strong style={{ textTransform: "capitalize" }}>
                    {analitycs.status}
                  </strong>
                </Typography>
                <Link href={`/animals/${id}/analitycs`} underline="hover">
                  <Typography>Watch detailed analitycs</Typography>
                </Link>
              </Stack>
            )}
          </Stack>
          <Stack flexDirection="row" alignItems="flex-start">
            <IconButton href={`/animals/${animal.id}/edit`}>
              <EditIcon color="primary" />
            </IconButton>
            <DeleteButton path={`/animals/${animal.id}`} />
          </Stack>
        </Stack>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Heartbeat</TableCell>
              <TableCell>Respiration rate</TableCell>
              <TableCell>Temperature</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {animalMetrics?.map((metric) => (
              <TableRow key={animal.id}>
                <TableCell>{metric.heartbeat}</TableCell>
                <TableCell>{metric.respirationRate}</TableCell>
                <TableCell>{metric.temperature}</TableCell>
                <TableCell align="right">
                  {formatDate(metric.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Container>
  );
}
