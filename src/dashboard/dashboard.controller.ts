import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser, PlatformRoles } from '../common/decorators';

@ApiTags('لوحة التحكم')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('org')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'Org dashboard — students, attendance, finance' })
  @ApiOkResponse({ description: 'Org stats' })
  getOrgStats(@CurrentUser('orgId') orgId: number) {
    return this.dashboardService.getOrgStats(orgId);
  }

  @Get('platform')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({
    summary: 'Platform dashboard — orgs, subscriptions, revenue',
  })
  @ApiOkResponse({ description: 'Platform stats' })
  getPlatformStats() {
    return this.dashboardService.getPlatformStats();
  }

  @Get('financial')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'Monthly financial summary' })
  @ApiOkResponse({ description: 'Income, expenses, net for the month' })
  getFinancialSummary(
    @CurrentUser('orgId') orgId: number,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.dashboardService.getFinancialSummary(orgId, month, year);
  }

  @Get('attendance')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'Attendance summary with top absentees' })
  @ApiOkResponse({ description: 'Attendance breakdown' })
  getAttendanceSummary(
    @CurrentUser('orgId') orgId: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.dashboardService.getAttendanceSummary(orgId, dateFrom, dateTo);
  }
}
