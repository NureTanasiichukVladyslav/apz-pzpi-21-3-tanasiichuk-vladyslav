import { Module } from '@nestjs/common';
import { MetricService } from './metrics.service';
import { MetricController } from './metrics.controller';
import { AnalitycsModule } from 'src/analitycs';

@Module({
  imports: [AnalitycsModule],
  controllers: [MetricController],
  providers: [MetricService],
})
export class MetricModule {}
