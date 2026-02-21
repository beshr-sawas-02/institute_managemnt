// src/payments/payments.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('المدفوعات')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'إنشاء دفعة جديدة' })
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب جميع المدفوعات' })
  findAll(@Query() p: PaginationDto) {
    return this.service.findAll(p);
  }

  @Get('stats')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إحصائيات المدفوعات' })
  getStats(@Query('academicYear') academicYear?: string) {
    return this.service.getStats(academicYear);
  }

  @Get('student/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({ summary: 'جلب مدفوعات طالب' })
  findByStudent(@Param('studentId', ParseIntPipe) id: number) {
    return this.service.findByStudent(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب دفعة بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'تحديث دفعة' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف دفعة' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}