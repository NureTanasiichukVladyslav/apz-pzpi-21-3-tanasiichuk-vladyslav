import { getUser } from "@/services/get-user";
import { getAnimalSpecies } from "@/services/get-animal-species";
import { EditAnimalForm } from "@/components";
import { getAnimal } from "@/services/get-animal";

export default async function Page({
  params: { id },
}: {
  params: { id: number };
}) {
  const [user, animalSpecies, animal] = await Promise.all([
    getUser(),
    getAnimalSpecies(),
    getAnimal(id),
  ]);

  if (!user || !animalSpecies || !animal) {
    return null;
  }

  return (
    <EditAnimalForm user={user} animalSpecies={animalSpecies} animal={animal} />
  );
}
