// src/payments/payments.module.ts

import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { TuitionFeesModule } from '../tuition-fees/tuition-fees.module';

@Module({
  imports: [NotificationsModule, TuitionFeesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}