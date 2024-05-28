import { getUser } from "@/services/get-user";
import { getAnimalSpecies } from "@/services/get-animal-species";
import { CreateAnimalForm } from "@/components";

export default async function Page() {
  const [user, animalSpecies] = await Promise.all([
    getUser(),
    getAnimalSpecies(),
  ]);

  if (!user || !animalSpecies) {
    return null;
  }

  return <CreateAnimalForm user={user} animalSpecies={animalSpecies} />;
}
