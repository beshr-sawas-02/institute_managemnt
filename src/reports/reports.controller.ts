import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ReportsService } from './reports.service';
import { MonthlyReportService } from './monthly-report.service';
import { CreateReportDto } from './dto/report.dto';
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
  create(
    @CurrentUser('orgId') orgId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateReportDto,
  ) {
    return this.service.create(orgId, userId, dto);
  }

  @Get('monthly/student/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({ summary: 'تقرير شهري لطالب واحد' })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  getStudentMonthlyReport(
    @CurrentUser('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.monthlyReportService.generateStudentMonthlyReport(
      orgId,
      studentId,
      Number(month),
      Number(year),
    );
  }

  @Get('monthly/section/:sectionId')
  @ApiOperation({ summary: 'تقرير شهري لشعبة كاملة' })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  getSectionMonthlyReport(
    @CurrentUser('orgId') orgId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.monthlyReportService.generateSectionMonthlyReports(
      orgId,
      sectionId,
      Number(month),
      Number(year),
    );
  }

  @Post('monthly/section/:sectionId/notify')
  @ApiOperation({ summary: 'إنشاء تقرير شهري لشعبة وإرسال إشعارات' })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  generateAndNotifySectionReports(
    @CurrentUser('orgId') orgId: number,
    @CurrentUser('id') userId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.monthlyReportService.generateAndNotifySectionReports(
      orgId,
      sectionId,
      Number(month),
      Number(year),
      userId,
    );
  }

  @Post('monthly/all/notify')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إنشاء تقارير شهرية لجميع الشعب' })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  generateAndNotifyAllSections(
    @CurrentUser('orgId') orgId: number,
    @CurrentUser('id') userId: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.monthlyReportService.generateAndNotifyAllSections(
      orgId,
      Number(month),
      Number(year),
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع التقارير' })
  findAll(@CurrentUser('orgId') orgId: number, @Query() p: PaginationDto) {
    return this.service.findAll(orgId, p);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب تقرير بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(orgId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف تقرير' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(orgId, id);
  }
}
