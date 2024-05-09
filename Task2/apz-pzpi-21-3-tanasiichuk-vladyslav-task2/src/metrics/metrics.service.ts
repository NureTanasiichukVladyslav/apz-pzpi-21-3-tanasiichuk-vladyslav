import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { MetricDto, CreateEditMetricDto } from './dtos';
import { NotFoundMetric } from './common';

@Injectable()
export class MetricService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getMetrics(animalId: number): Promise<MetricDto[]> {
    const metrics = await this.prismaService.metric.findMany({
      select: {
        id: true,
        heartbeat: true,
        respirationRate: true,
        temperature: true,
        timestamp: true,
        animal: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        animalId,
      },
    });

    return metrics.map((metric) => ({
      id: metric.id,
      heartbeat: metric.heartbeat,
      respirationRate: metric.respirationRate,
      temperature: metric.temperature,
      timestamp: metric.timestamp.toISOString(),
      animal: {
        id: metric.animal.id,
        name: metric.animal.name,
      },
    }));
  }

  public async getMetric(id: number): Promise<MetricDto> {
    const metric = await this.prismaService.metric.findFirst({
      select: {
        id: true,
        heartbeat: true,
        respirationRate: true,
        temperature: true,
        timestamp: true,
        animal: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!metric) {
      throw new NotFoundMetric('There is no metric with such id');
    }

    return {
      id: metric.id,
      heartbeat: metric.heartbeat,
      respirationRate: metric.respirationRate,
      temperature: metric.temperature,
      timestamp: metric.timestamp.toISOString(),
      animal: {
        id: metric.animal.id,
        name: metric.animal.name,
      },
    };
  }

  public async createMetric(req: CreateEditMetricDto): Promise<{ id: number }> {
    const metric = await this.prismaService.metric.create({
      data: {
        heartbeat: req.heartbeat,
        respirationRate: req.respirationRate,
        temperature: req.temperature,
        timestamp: req.timestamp,
        animalId: req.animalId,
      },
      select: {
        id: true,
      },
    });

    return {
      id: metric.id,
    };
  }

  public async editMetric(
    req: CreateEditMetricDto,
    metricId: number,
  ): Promise<{ id: number }> {
    const metric = await this.prismaService.metric.findFirst({
      select: {
        id: true,
      },
      where: {
        id: metricId,
      },
    });

    if (!metric) {
      throw new NotFoundMetric('There is no metric with such id');
    }

    await this.prismaService.metric.update({
      data: {
        heartbeat: req.heartbeat,
        respirationRate: req.respirationRate,
        temperature: req.temperature,
        timestamp: req.timestamp,
        animalId: req.animalId,
      },
      where: {
        id: metricId,
      },
    });

    return {
      id: metricId,
    };
  }

  public async deleteMetric(id: number): Promise<void> {
    const metric = await this.prismaService.metric.findFirst({
      select: {
        id: true,
      },
      where: {
        id,
      },
    });

    if (!metric) {
      throw new NotFoundMetric('There is no metric with such id');
    }

    await this.prismaService.metric.delete({
      where: {
        id,
      },
    });
  }
}
