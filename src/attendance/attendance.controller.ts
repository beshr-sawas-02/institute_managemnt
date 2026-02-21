// src/attendance/attendance.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto, UpdateAttendanceDto, BulkAttendanceDto, AttendanceFilterDto,
} from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('الحضور')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiOperation({ summary: 'تسجيل حضور طالب' })
  create(@Body() dto: CreateAttendanceDto) { return this.service.create(dto); }

  @Post('bulk')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiOperation({ summary: 'تسجيل حضور مجموعة طلاب' })
  bulkCreate(@Body() dto: BulkAttendanceDto) { return this.service.bulkCreate(dto); }

  @Get()
  @ApiOperation({ summary: 'جلب سجلات الحضور' })
  findAll(@Query() filter: AttendanceFilterDto) { return this.service.findAll(filter); }

  @Get('stats/:studentId')
  @ApiOperation({ summary: 'إحصائيات حضور طالب' })
  getStudentStats(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.service.getStudentStats(studentId, dateFrom, dateTo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب سجل حضور بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.teacher)
  @ApiOperation({ summary: 'تحديث سجل حضور' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAttendanceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف سجل حضور' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}