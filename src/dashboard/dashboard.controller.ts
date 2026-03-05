import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('لوحة التحكم')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.reception)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'جلب جميع إحصائيات لوحة التحكم' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('financial')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'ملخص مالي شهري' })
  getFinancialSummary(
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.dashboardService.getFinancialSummary(month, year);
  }

  @Get('attendance')
  @ApiOperation({ summary: 'ملخص الحضور' })
  getAttendanceSummary(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.dashboardService.getAttendanceSummary(dateFrom, dateTo);
  }
}