// src/expenses/expenses.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('المصاريف')
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.admin)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'إضافة مصروف جديد' })
  create(@CurrentUser('id') userId: number, @Body() dto: CreateExpenseDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع المصاريف' })
  findAll(@Query() p: PaginationDto) { return this.service.findAll(p); }

  @Get('stats')
  @ApiOperation({ summary: 'إحصائيات المصاريف' })
  getStats(@Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string) {
    return this.service.getStats(dateFrom, dateTo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب مصروف بالمعرف' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'تحديث مصروف' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExpenseDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف مصروف' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}