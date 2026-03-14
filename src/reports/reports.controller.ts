// src/reports/reports.controller.ts
// متحكم التقارير - محدّث مع التقارير الشهرية

import {
  Controller, Get, Post, Body, Param, Delete,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ReportsService } from './reports.service';
import { MonthlyReportService } from './monthly-report.service';
import { CreateReportDto } from './dto/report.dto';
import { GenerateMonthlyReportDto, GenerateSectionMonthlyReportDto } from './dto/monthly-report.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('التقارير')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin, UserRole.reception)
@ApiBearerAuth()
export class ReportsController {
  constructor(
    private readonly service: ReportsService,
    private readonly monthlyReportService: MonthlyReportService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء تقرير جديد' })
  create(@CurrentUser('id') userId: number, @Body() dto: CreateReportDto) {
    return this.service.create(userId, dto);
  }

  // ==================== التقارير الشهرية ====================

  @Get('monthly/student/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({
    summary: 'تقرير شهري لطالب واحد',
    description: 'يعرض تقييمات المذاكرات والفحوص فقط (بدون الكويزات والواجبات)',
  })
  @ApiQuery({ name: 'month', required: true, example: 3, description: 'رقم الشهر (1-12)' })
  @ApiQuery({ name: 'year', required: true, example: 2025, description: 'السنة' })
  getStudentMonthlyReport(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.monthlyReportService.generateStudentMonthlyReport(
      studentId,
      Number(month),
      Number(year),
    );
  }

  @Get('monthly/section/:sectionId')
  @ApiOperation({
    summary: 'تقرير شهري لشعبة كاملة',
    description: 'يعرض تقارير جميع طلاب الشعبة',
  })
  @ApiQuery({ name: 'month', required: true, example: 3 })
  @ApiQuery({ name: 'year', required: true, example: 2025 })
  getSectionMonthlyReport(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.monthlyReportService.generateSectionMonthlyReports(
      sectionId,
      Number(month),
      Number(year),
    );
  }

  @Post('monthly/section/:sectionId/notify')
  @ApiOperation({
    summary: 'إنشاء تقرير شهري لشعبة وإرسال إشعارات للأهل',
    description: 'ينشئ تقرير شهري لكل طالب في الشعبة ويرسل إشعار push لولي أمره',
  })
  @ApiQuery({ name: 'month', required: true, example: 3 })
  @ApiQuery({ name: 'year', required: true, example: 2025 })
  generateAndNotifySectionReports(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('month') month: number,
    @Query('year') year: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.monthlyReportService.generateAndNotifySectionReports(
      sectionId,
      Number(month),
      Number(year),
      userId,
    );
  }

  @Post('monthly/all/notify')
  @Roles(UserRole.admin)
  @ApiOperation({
    summary: 'إنشاء تقارير شهرية لجميع الشعب وإرسال إشعارات',
    description: 'ينشئ تقارير شهرية لكل الطلاب في كل الشعب النشطة ويرسل إشعارات لأولياء الأمور',
  })
  @ApiQuery({ name: 'month', required: true, example: 3 })
  @ApiQuery({ name: 'year', required: true, example: 2025 })
  generateAndNotifyAllSections(
    @Query('month') month: number,
    @Query('year') year: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.monthlyReportService.generateAndNotifyAllSections(
      Number(month),
      Number(year),
      userId,
    );
  }

  // ==================== التقارير العامة ====================

  @Get()
  @ApiOperation({ summary: 'جلب جميع التقارير' })
  findAll(@Query() p: PaginationDto) {
    return this.service.findAll(p);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب تقرير بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف تقرير' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}