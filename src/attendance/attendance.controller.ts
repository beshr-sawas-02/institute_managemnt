import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  BulkAttendanceDto,
  SmartBulkAttendanceDto,
  UpdateAttendanceDto,
} from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { Roles } from '@/common/decorators';
import { RolesGuard } from '@/common/guards';

@ApiTags('الحضور')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ==================== تسجيل ====================

  @Post()
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تسجيل حضور طالب واحد' })
  create(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.create(dto);
  }

  @Post('bulk')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تسجيل حضور جماعي يدوي' })
  bulkCreate(@Body() dto: BulkAttendanceDto) {
    return this.attendanceService.bulkCreate(dto);
  }

  @Post('smart-bulk')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({
    summary: 'تسجيل حضور ذكي - الكل حضور ما عدا الاستثناءات',
    description:
      'يسجل حضور لكل طلاب الشعبة تلقائياً، فقط الغائبين والمتأخرين يُذكرون في exceptions',
  })
  smartBulkCreate(@Body() dto: SmartBulkAttendanceDto) {
    return this.attendanceService.smartBulkCreate(dto);
  }

  // ==================== كشف الحضور ====================

  @Get('section/:sectionId/sheet')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({
    summary: 'كشف حضور الشعبة ليوم معين',
    description:
      'يجيب قائمة الطلاب مرتبين أبجدياً مع حالة حضورهم - null إذا لم يُسجَّل بعد',
  })
  @ApiQuery({ name: 'date', example: '2025-09-14' })
  getSectionSheet(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getSectionAttendanceSheet(sectionId, date);
  }

  // ==================== جلب السجلات ====================

  @Get()
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب سجلات الحضور مع فلترة' })
  findAll(
    @Query('date') date?: string,
    @Query('sectionId') sectionId?: string,
  ) {
    return this.attendanceService.findAll({
      date,
      sectionId: sectionId ? parseInt(sectionId) : undefined,
    });
  }

  @Get('section/:sectionId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'حضور شعبة في يوم معين' })
  @ApiQuery({ name: 'date', example: '2025-09-14' })
  findBySection(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('date') date: string,
  ) {
    return this.attendanceService.findBySection(sectionId, date);
  }

  @Get('student/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher, UserRole.parent)
  @ApiOperation({ summary: 'سجل حضور طالب معين' })
  findByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.attendanceService.findByStudent(studentId, dateFrom, dateTo);
  }

  @Get('stats/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher, UserRole.parent)
  @ApiOperation({ summary: 'إحصائيات حضور طالب' })
  getStats(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.attendanceService.getStats(studentId, dateFrom, dateTo);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تفاصيل سجل حضور' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  // ==================== تعديل وحذف ====================

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تعديل سجل حضور' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف سجل حضور' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.remove(id);
  }
}