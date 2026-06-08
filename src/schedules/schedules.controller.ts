import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('الجداول الزمنية')
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إضافة حصة جديدة' })
  create(@CurrentUser('orgId') orgId: number, @Body() dto: CreateScheduleDto) {
    return this.service.create(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع الحصص' })
  findAll(@CurrentUser('orgId') orgId: number) {
    return this.service.findAll(orgId);
  }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'جلب جدول شعبة' })
  findBySection(
    @CurrentUser('orgId') orgId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ) {
    return this.service.findBySection(orgId, sectionId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'جلب جدول معلم' })
  findByTeacher(
    @CurrentUser('orgId') orgId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
  ) {
    return this.service.findByTeacher(orgId, teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب حصة بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث حصة' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف حصة' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(orgId, id);
  }
}
