import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnimalDto, CreateEditAnimalDto } from './dtos';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AnimalService } from './animals.service';
import { NotFoundAnimal } from './common';
import { AuthGuard } from 'src/auth';

@ApiTags('animals')
@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getAnimals(@Req() req) {
    return await this.animalService.getAnimals(req.user.sub);
  }

  @Get(':id')
  async getAnimal(@Param('id', ParseIntPipe) id: number): Promise<AnimalDto> {
    try {
      return await this.animalService.getAnimal(id);
    } catch (error) {
      if (error instanceof NotFoundAnimal) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createAnimal(@Body() body: CreateEditAnimalDto) {
    return await this.animalService.createAnimal(body);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async editAnimal(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateEditAnimalDto,
  ) {
    try {
      return await this.animalService.editAnimal(body, id);
    } catch (error) {
      if (error instanceof NotFoundAnimal) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deleteAnimal(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.animalService.deleteAnimal(id);
    } catch (error) {
      if (error instanceof NotFoundAnimal) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
