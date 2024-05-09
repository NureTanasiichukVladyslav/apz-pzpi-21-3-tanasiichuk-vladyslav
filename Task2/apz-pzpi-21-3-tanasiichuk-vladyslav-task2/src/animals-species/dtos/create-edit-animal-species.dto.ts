import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEditAnimalSpeciesDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;
}
