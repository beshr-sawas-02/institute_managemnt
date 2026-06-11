import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionExpiryCron {
  private readonly logger = new Logger(SubscriptionExpiryCron.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionExpiry() {
    this.logger.log('Running subscription expiry check...');

    const now = new Date();

    const result = await this.prisma.subscription.updateMany({
      where: {
        endDate: { lt: now },
        status: { not: 'expired' },
      },
      data: { status: 'expired' },
    });

    await this.prisma.organization.updateMany({
      where: {
        isActive: true,
        subscriptions: { none: { status: 'active' } },
      },
      data: { isActive: false },
    });

    this.logger.log(`Marked ${result.count} subscription(s) as expired`);
  }
}
