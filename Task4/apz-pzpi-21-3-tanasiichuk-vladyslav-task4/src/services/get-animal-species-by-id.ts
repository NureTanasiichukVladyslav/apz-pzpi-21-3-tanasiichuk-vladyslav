import { AnimalSpeciesDto } from "@/types";
import { fetchClient } from "@/utils/fetch";

export async function getAnimalSpeciesById(id: number) {
  return fetchClient.get<AnimalSpeciesDto>(`animal-species/${id}`);
}
