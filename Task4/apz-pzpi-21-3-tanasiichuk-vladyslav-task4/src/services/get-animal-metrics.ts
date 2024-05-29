import { MetricDto } from "@/types";
import { fetchClient } from "@/utils/fetch";

export async function getAnimalMetricsData(id: number) {
  return fetchClient.get<MetricDto[]>(`animals/${id}/metrics`);
}
