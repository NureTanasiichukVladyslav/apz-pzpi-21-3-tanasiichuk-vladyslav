import EditIcon from "@mui/icons-material/Edit";
import { DeleteButton } from "@/components";
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
import { getAnimalMetricsData } from "@/services/get-animal-metrics";
import { getAnalitycs } from "@/services/get-analitycs";
import { getAnimal } from "@/services/get-animal";
import { formatMetricDate } from "@/utils/format-metric-date";
import initTranslations from "@/app/i18n";
import { translateAnimalStatus } from "@/utils/translate-animal-status";

export default async function Page({
  params: { id, locale },
}: {
  params: { id: number; locale: string };
}) {
  const [animal, animalMetrics, analitycs] = await Promise.all([
    getAnimal(id),
    getAnimalMetricsData(id),
    getAnalitycs(id),
  ]);

  const { t } = await initTranslations(locale);

  if (!animal) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Stack gap={4}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack gap={2}>
            <Typography variant="h4">{animal.name}</Typography>
            <Typography>
              {t("species")}: {animal.species.name}
            </Typography>
            <Typography>
              {t("dateOfBirth")}: {formatDate(animal.dateOfBirth)}
            </Typography>
            {animalMetrics && (
              <Stack gap={2}>
                <Typography variant="body1" fontWeight="600">
                  {t("lastMetrics")}:
                </Typography>
                <Stack direction="row">
                  <Typography>
                    {t("heartbeat")}:{" "}
                    <strong>{animalMetrics[0].heartbeat}</strong>
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography>
                    {t("respirationRate")}:{" "}
                    <strong>{animalMetrics[0].respirationRate}</strong>
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography>
                    {t("temperature")}:{" "}
                    <strong>{animalMetrics[0].temperature}</strong>
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography>
                    {t("time")}:{" "}
                    <strong>{formatDate(animalMetrics[0].timestamp)}</strong>
                  </Typography>
                </Stack>
              </Stack>
            )}
            {analitycs && (
              <Stack direction="row" gap={2} alignItems="center" mt={2}>
                <Typography variant="body1">
                  {t("status")}:{" "}
                  <strong style={{ textTransform: "capitalize" }}>
                    {translateAnimalStatus(locale, analitycs.status)}
                  </strong>
                </Typography>
                <Link href={`/animals/${id}/analitycs`} underline="hover">
                  <Typography>{t("watchDetailedAnalitycs")}</Typography>
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
              <TableCell>{t("heartbeat")}</TableCell>
              <TableCell>{t("respirationRate")}</TableCell>
              <TableCell>{t("temperature")}</TableCell>
              <TableCell align="right">{t("time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {animalMetrics?.map((metric) => (
              <TableRow key={animal.id}>
                <TableCell>{metric.heartbeat}</TableCell>
                <TableCell>{metric.respirationRate}</TableCell>
                <TableCell>{metric.temperature}</TableCell>
                <TableCell align="right">
                  {formatMetricDate(metric.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Container>
  );
}
