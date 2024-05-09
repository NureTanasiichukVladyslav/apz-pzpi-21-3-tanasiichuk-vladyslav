import { Module } from '@nestjs/common';
import { AnimalService } from './animals.service';
import { AnimalController } from './animals.controller';

@Module({
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
