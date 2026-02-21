// src/reports/reports.controller.ts
import {
  Controller, Get, Post, Body, Param, Delete,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/report.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('التقارير')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'إنشاء تقرير جديد' })
  create(@CurrentUser('id') userId: number, @Body() dto: CreateReportDto) {
    return this.service.create(userId, dto);
  }

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