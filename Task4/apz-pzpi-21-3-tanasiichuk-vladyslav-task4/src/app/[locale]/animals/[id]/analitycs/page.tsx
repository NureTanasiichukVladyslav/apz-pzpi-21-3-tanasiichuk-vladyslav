import { getAnalitycs } from "@/services/get-analitycs";
import { getAnimal } from "@/services/get-animal";
import { getAnimalSpeciesById } from "@/services/get-animal-species-by-id";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { MetricLineChart } from "./ui";
import { getAnimalMetricsData } from "@/services/get-animal-metrics";
import initTranslations from "@/app/i18n";
import { translateAnimalStatus } from "@/utils/translate-animal-status";

export default async function Page({
  params: { id, locale },
}: {
  params: { id: number; locale: string };
}) {
  const animal = await getAnimal(id);

  if (!animal) {
    return null;
  }

  const { t } = await initTranslations(locale);

  const [analitycs, animalSpecies, metrics] = await Promise.all([
    getAnalitycs(id),
    getAnimalSpeciesById(animal.species.id),
    getAnimalMetricsData(id),
  ]);

  if (!metrics || !animalSpecies) {
    return null;
  }

  const heartbeatData = metrics.map(({ heartbeat, timestamp }, index) => ({
    time: index,
    value: heartbeat,
    timestamp,
  }));
  const respirationData = metrics.map(
    ({ respirationRate, timestamp }, index) => ({
      time: index,
      value: respirationRate,
      timestamp,
    })
  );
  const temperatureData = metrics.map(({ temperature, timestamp }, index) => ({
    time: index,
    value: temperature,
    timestamp,
  }));

  return (
    <Container maxWidth="lg">
      <Stack gap={2}>
        <Typography variant="h4">{animal.name}</Typography>
        {analitycs && (
          <Stack>
            <Stack gap={2}>
              <Typography variant="body1" fontWeight="600">
                {t("avgMetrics")}:
              </Typography>
              <Stack direction="row">
                <Typography>
                  {t("heartbeat")}:{" "}
                  <strong>{analitycs.heartbeat.toFixed(1)}</strong>
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography>
                  {t("respirationRate")}:{" "}
                  <strong>{analitycs.respirationRate.toFixed(1)}</strong>
                </Typography>
              </Stack>
              <Stack direction="row">
                <Typography>
                  {t("temperature")}:{" "}
                  <strong>{analitycs.temperature.toFixed(1)}</strong>
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" gap={2} alignItems="center" mt={2}>
              <Typography variant="body1">
                {t("status")}:{" "}
                <strong style={{ textTransform: "capitalize" }}>
                  {translateAnimalStatus(locale, analitycs.status)}
                </strong>
              </Typography>
            </Stack>
          </Stack>
        )}
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={6}>
            <MetricLineChart
              label={t("heartbeat")}
              data={heartbeatData}
              criticalMin={animalSpecies.minHeartbeat}
              criticalMax={animalSpecies.maxHeartbeat}
            />
          </Grid>
          <Grid item xs={6}>
            <MetricLineChart
              label={t("respirationRate")}
              data={respirationData}
              criticalMin={animalSpecies.minRespirationRate}
              criticalMax={animalSpecies.maxRespirationRate}
            />
          </Grid>
          <Grid item xs={6}>
            <MetricLineChart
              label={t("temperature")}
              data={temperatureData}
              criticalMin={animalSpecies.minTemperature}
              criticalMax={animalSpecies.maxTemperature}
            />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
