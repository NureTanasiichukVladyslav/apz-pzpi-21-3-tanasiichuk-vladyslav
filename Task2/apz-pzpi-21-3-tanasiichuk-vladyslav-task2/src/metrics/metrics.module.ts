import { Module } from '@nestjs/common';
import { MetricService } from './metrics.service';
import { MetricController } from './metrics.controller';

@Module({
  controllers: [MetricController],
  providers: [MetricService],
})
export class MetricModule {}
