import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AnimalSpeciesDto, CreateEditAnimalSpeciesDto } from './dtos';
import { NotFoundAnimalSpecies } from './common';

@Injectable()
export class AnimalSpeciesService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllAnimalSpecies(): Promise<AnimalSpeciesDto[]> {
    return this.prismaService.animalSpecies.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  public async getAnimalSpecies(id: number): Promise<AnimalSpeciesDto> {
    const animalSpecies = await this.prismaService.animalSpecies.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        id,
      },
    });

    if (!animalSpecies) {
      throw new NotFoundAnimalSpecies('There is no animalSpecies with such id');
    }

    return {
      id: animalSpecies.id,
      name: animalSpecies.name,
    };
  }

  public async createAnimalSpecies(
    req: CreateEditAnimalSpeciesDto,
  ): Promise<{ id: number }> {
    const animalSpecies = await this.prismaService.animalSpecies.create({
      data: {
        name: req.name,
      },
      select: {
        id: true,
      },
    });

    return {
      id: animalSpecies.id,
    };
  }

  public async editAnimalSpecies(
    req: CreateEditAnimalSpeciesDto,
    animalSpeciesId: number,
  ): Promise<{ id: number }> {
    const animalSpecies = await this.prismaService.animalSpecies.findFirst({
      select: {
        id: true,
      },
      where: {
        id: animalSpeciesId,
      },
    });

    if (!animalSpecies) {
      throw new NotFoundAnimalSpecies('There is no animalSpecies with such id');
    }

    await this.prismaService.animalSpecies.update({
      data: {
        name: req.name,
      },
      where: {
        id: animalSpeciesId,
      },
    });

    return {
      id: animalSpeciesId,
    };
  }

  public async deleteAnimalSpecies(id: number): Promise<void> {
    const animalSpecies = await this.prismaService.animalSpecies.findFirst({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });

    if (!animalSpecies) {
      throw new NotFoundAnimalSpecies('There is no animalSpecies with such id');
    }

    await this.prismaService.animalSpecies.delete({
      where: {
        id,
      },
    });
  }
}
