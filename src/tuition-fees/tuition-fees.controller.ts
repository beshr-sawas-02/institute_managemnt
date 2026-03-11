// src/tuition-fees/tuition-fees.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { TuitionFeesService } from './tuition-fees.service';
import { CreateTuitionFeeDto, UpdateTuitionFeeDto } from './dto/tuition-fee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('أقساط الصفوف')
@Controller('tuition-fees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TuitionFeesController {
  constructor(private readonly service: TuitionFeesService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديد قسط سنوي لصف' })
  create(@CurrentUser('id') userId: number, @Body() dto: CreateTuitionFeeDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب جميع أقساط الصفوف' })
  @ApiQuery({ name: 'academicYear', required: false, example: '2024-2025' })
  findAll(@Query('academicYear') academicYear?: string) {
    return this.service.findAll(academicYear);
  }

  @Get('grade/:gradeId')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب قسط صف معين لسنة دراسية' })
  @ApiQuery({ name: 'academicYear', required: true, example: '2024-2025' })
  findByGrade(
    @Param('gradeId', ParseIntPipe) gradeId: number,
    @Query('academicYear') academicYear: string,
  ) {
    return this.service.findByGrade(gradeId, academicYear);
  }

  @Get('student/:studentId/balance')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({
    summary: 'رصيد الطالب - القسط السنوي والمدفوع والمتبقي',
    description:
      'يعرض القسط السنوي للصف، إجمالي المبلغ المدفوع، والمبلغ المتبقي للطالب في سنة دراسية معينة',
  })
  @ApiQuery({ name: 'academicYear', required: true, example: '2024-2025' })
  getStudentBalance(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('academicYear') academicYear: string,
  ) {
    return this.service.getStudentBalance(studentId, academicYear);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب قسط بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث قسط' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTuitionFeeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف قسط' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}