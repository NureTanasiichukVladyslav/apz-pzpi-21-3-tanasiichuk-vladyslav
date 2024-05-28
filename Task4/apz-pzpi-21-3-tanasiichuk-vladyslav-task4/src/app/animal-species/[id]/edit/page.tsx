import { EditAnimalSpeciesForm } from "@/components";
import { getAnimalSpeciesById } from "@/services/get-animal-species-by-id";

export default async function Page({
  params: { id },
}: {
  params: { id: number };
}) {
  const animalSpecies = await getAnimalSpeciesById(id);

  if (!animalSpecies) {
    return null;
  }

  return <EditAnimalSpeciesForm animalSpecies={animalSpecies} />;
}
