export class AnimalDto {
  id: number;
  name: string;
  dateOfBirth: string;
  species: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    login: string;
  };
}
