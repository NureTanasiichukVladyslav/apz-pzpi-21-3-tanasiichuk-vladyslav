import { AnimalSpeciesDto } from "@/types";
import { fetchClient } from "@/utils/fetch";

export async function getAnimalSpecies() {
  return fetchClient.get<AnimalSpeciesDto[]>(`animal-species`, {
    next: { tags: ["species"] },
  });
}
