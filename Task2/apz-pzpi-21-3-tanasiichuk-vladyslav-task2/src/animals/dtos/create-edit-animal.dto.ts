import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEditAnimalDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsInt()
  speciesId: number;

  @ApiProperty()
  @IsInt()
  userId: number;
}
