// src/assessments/assessments.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto, UpdateAssessmentDto } from './dto/assessment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('التقييمات')
@Controller('assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssessmentsController {
  constructor(private readonly service: AssessmentsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.teacher,UserRole.reception)
  @ApiOperation({ summary: 'إضافة تقييم جديد' })
  create(@Body() dto: CreateAssessmentDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'جلب جميع التقييمات' })
  findAll(@Query() p: PaginationDto) { return this.service.findAll(p); }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'جلب تقييمات طالب' })
  findByStudent(@Param('studentId', ParseIntPipe) id: number) {
    return this.service.findByStudent(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب تقييم بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.teacher,UserRole.reception)
  @ApiOperation({ summary: 'تحديث تقييم' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssessmentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin,UserRole.reception)
  @ApiOperation({ summary: 'حذف تقييم' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}