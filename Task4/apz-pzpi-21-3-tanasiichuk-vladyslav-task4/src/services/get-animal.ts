import { AnimalDto } from "@/types";
import { fetchClient } from "@/utils/fetch";

export async function getAnimal(id: number) {
  return fetchClient.get<AnimalDto>(`animals/${id}`);
}
