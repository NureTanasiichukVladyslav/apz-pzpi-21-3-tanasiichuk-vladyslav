import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AnalitycsDto, GetAnalitycsRequestDto } from './dtos';
import { NotificationService } from 'src/notifications/notifications.service';
import { CreateEditMetricDto } from 'src/metrics/dtos';

@Injectable()
export class AnalitycsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  public async getAverageMetricsAnalitycs(
    animalId: number,
    req: GetAnalitycsRequestDto,
  ): Promise<AnalitycsDto> {
    const metrics = await this.prismaService.metric.findMany({
      select: {
        heartbeat: true,
        respirationRate: true,
        temperature: true,
        animal: {
          select: {
            species: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      where: {
        animalId,
        timestamp: {
          lte: req.endDate,
          gte: req.startDate,
        },
      },
    });

    const { status } = this.getStatus(metrics);
    const avgMetrics = metrics.reduce(
      (acc, metric) => {
        acc.avgHeartbeat += metric.heartbeat;
        acc.avgRespirationRate += metric.respirationRate;
        acc.avgTemperature += metric.temperature;
        return acc;
      },
      {
        avgHeartbeat: 0,
        avgRespirationRate: 0,
        avgTemperature: 0,
      },
    );

    avgMetrics.avgHeartbeat /= metrics.length;
    avgMetrics.avgRespirationRate /= metrics.length;
    avgMetrics.avgTemperature /= metrics.length;

    return {
      id: animalId,
      heartbeat: avgMetrics.avgHeartbeat,
      respirationRate: avgMetrics.avgRespirationRate,
      temperature: avgMetrics.avgTemperature,
      status,
    };
  }

  public async getLastMetricsAnalytics(
    req: CreateEditMetricDto,
    userId: number,
  ): Promise<{ status: string }> {
    const metrics = await this.prismaService.metric.findMany({
      select: {
        heartbeat: true,
        respirationRate: true,
        temperature: true,
        animal: {
          select: {
            id: true,
            name: true,
            species: true,
            userId: true,
          },
        },
      },
      take: 1,
      orderBy: { timestamp: 'desc' },
      where: {
        animalId: req.animalId,
      },
    });

    const status = this.getStatus([...metrics, req]);
    await this.sendNotification(
      status,
      {
        id: metrics[0].animal.id,
        name: metrics[0].animal.name,
      },
      userId,
    );

    return {
      status: status.status,
    };
  }

  private getStatus(
    metrics: {
      heartbeat: number;
      respirationRate: number;
      temperature: number;
      animal?: {
        species: {
          id: number;
          name: string;
          description: string;
          minHeartbeat: number;
          maxHeartbeat: number;
          minRespirationRate: number;
          maxRespirationRate: number;
          minTemperature: number;
          maxTemperature: number;
        };
      };
    }[],
  ): { status: AnalitycsDto['status']; reasons: string[] } {
    if (metrics.length === 0) {
      return {
        status: 'fine',
        reasons: [],
      };
    }

    const firstMetric = metrics[0];
    const lastMetric = metrics[metrics.length - 1];

    const {
      maxHeartbeat,
      minHeartbeat,
      maxRespirationRate,
      minRespirationRate,
      maxTemperature,
      minTemperature,
    } = lastMetric.animal.species;

    const reasons: string[] = [];

    const heartBeatDiff = Math.abs(
      lastMetric.heartbeat - firstMetric.heartbeat,
    );
    const respirationDiff = Math.abs(
      lastMetric.respirationRate - firstMetric.respirationRate,
    );
    const temperatureDiff = Math.abs(
      lastMetric.temperature - firstMetric.temperature,
    );

    const checkThresholds = (
      metric: string,
      value: number,
      status: AnalitycsDto['status'],
      min: number,
      max: number,
    ) => {
      if (value > max) {
        reasons.push(
          status === 'critical'
            ? `${metric} is critically high: ${value} (expected below ${max})`
            : `${metric} is ${status} high: ${value}`,
        );
      } else if (value < min) {
        reasons.push(
          status === 'critical'
            ? `${metric} is critically low: ${value} (expected above ${min})`
            : `${metric} is ${status} low: ${value}`,
        );
      }
    };

    const checkAllThresholds = (status: AnalitycsDto['status']) => {
      checkThresholds(
        'Heart rate',
        lastMetric.heartbeat,
        status,
        minHeartbeat,
        maxHeartbeat,
      );
      checkThresholds(
        'Respiration rate',
        lastMetric.respirationRate,
        status,
        minRespirationRate,
        maxRespirationRate,
      );
      checkThresholds(
        'Temperature',
        lastMetric.temperature,
        status,
        minTemperature,
        maxTemperature,
      );
    };

    if (
      lastMetric.heartbeat > maxHeartbeat ||
      lastMetric.heartbeat < minHeartbeat ||
      lastMetric.respirationRate > maxRespirationRate ||
      lastMetric.respirationRate < minRespirationRate ||
      lastMetric.temperature > maxTemperature ||
      lastMetric.temperature < minTemperature
    ) {
      checkAllThresholds('critical');

      return { status: 'critical', reasons };
    }

    if (
      heartBeatDiff > maxHeartbeat - minHeartbeat * 0.2 ||
      respirationDiff > maxRespirationRate - minRespirationRate * 0.2 ||
      temperatureDiff > maxTemperature - minTemperature * 0.2
    ) {
      checkAllThresholds('ill');

      return { status: 'ill', reasons };
    } else if (
      heartBeatDiff > (maxHeartbeat - minHeartbeat) * 0.1 ||
      respirationDiff > (maxRespirationRate - minRespirationRate) * 0.1 ||
      temperatureDiff > (maxTemperature - minTemperature) * 0.1
    ) {
      checkAllThresholds('warning');

      return { status: 'warning', reasons };
    } else {
      return { status: 'fine', reasons: [] };
    }
  }

  private async sendNotification(
    { status, reasons }: { status: AnalitycsDto['status']; reasons: string[] },
    animal: {
      id: number;
      name: string;
    },
    userId: number,
  ) {
    let message;

    if (status === 'critical') {
      message = `${
        animal.name
      } appears to be in critical condition. Seek immediate veterinary care. Reasons: ${reasons?.join(
        ', ',
      )}`;
    }

    if (status === 'warning') {
      message = `We've noticed slight changes in ${
        animal.name
      } vital signs. Keep an eye on them and consult a veterinarian if they worsen. Reasons: ${reasons?.join(
        ', ',
      )}`;
    }

    if (status === 'ill') {
      message = `${
        animal.name
      } may be ill. We recommend contacting a veterinarian as soon as possible. Reasons: ${reasons?.join(
        ', ',
      )}`;
    }

    if (status !== 'fine') {
      this.notificationService.createNotification(
        {
          message,
          animalId: animal.id,
        },
        userId,
      );
    }
  }
}
