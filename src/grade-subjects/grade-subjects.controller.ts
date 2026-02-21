// src/grade-subjects/grade-subjects.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { GradeSubjectsService } from './grade-subjects.service';
import { CreateGradeSubjectDto, UpdateGradeSubjectDto } from './dto/grade-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('مواد الصفوف')
@Controller('grade-subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GradeSubjectsController {
  constructor(private readonly service: GradeSubjectsService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'ربط مادة بصف' })
  create(@Body() dto: CreateGradeSubjectDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'جلب جميع مواد الصفوف' })
  findAll() { return this.service.findAll(); }

  @Get('grade/:gradeId')
  @ApiOperation({ summary: 'جلب مواد صف معين' })
  findByGrade(@Param('gradeId', ParseIntPipe) gradeId: number) {
    return this.service.findByGrade(gradeId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'جلب مواد معلم معين' })
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.service.findByTeacher(teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب مادة صف بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث ربط مادة بصف' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGradeSubjectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف ربط مادة بصف' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}