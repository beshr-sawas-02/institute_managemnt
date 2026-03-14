// src/reports/reports.module.ts

import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { MonthlyReportService } from './monthly-report.service';
import { ReportsController } from './reports.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ReportsController],
  providers: [ReportsService, MonthlyReportService],
  exports: [ReportsService, MonthlyReportService],
})
export class ReportsModule {}