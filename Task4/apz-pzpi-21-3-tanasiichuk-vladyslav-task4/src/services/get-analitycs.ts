import { AnalitycsDto } from "@/types";
import { fetchClient } from "@/utils/fetch";

export async function getAnalitycs(id: number) {
  return fetchClient.post<AnalitycsDto>(`analitycs/${id}`);
}
