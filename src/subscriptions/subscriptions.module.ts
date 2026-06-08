import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionExpiryCron } from './subscription-expiry.cron';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, SubscriptionExpiryCron],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
