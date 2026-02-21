// src/subjects/subjects.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('المواد الدراسية')
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إضافة مادة جديدة' })
  create(@Body() dto: CreateSubjectDto) { return this.subjectsService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'جلب جميع المواد' })
  findAll(@Query() p: PaginationDto) { return this.subjectsService.findAll(p); }

  @Get(':id')
  @ApiOperation({ summary: 'جلب مادة بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.subjectsService.findOne(id); }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث مادة' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubjectDto) {
    return this.subjectsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف مادة' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.subjectsService.remove(id); }
}