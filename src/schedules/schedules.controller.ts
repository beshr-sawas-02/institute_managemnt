// src/schedules/schedules.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('الجداول الزمنية')
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إضافة حصة جديدة' })
  create(@Body() dto: CreateScheduleDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'جلب جميع الحصص' })
  findAll() { return this.service.findAll(); }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'جلب جدول شعبة' })
  findBySection(@Param('sectionId', ParseIntPipe) id: number) {
    return this.service.findBySection(id);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'جلب جدول معلم' })
  findByTeacher(@Param('teacherId', ParseIntPipe) id: number) {
    return this.service.findByTeacher(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب حصة بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث حصة' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScheduleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف حصة' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}