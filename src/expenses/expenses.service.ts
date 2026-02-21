// src/expenses/expenses.service.ts
// خدمة إدارة المصاريف

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...dto,
        createdBy: userId,
        expenseDate: new Date(dto.expenseDate),
      },
      include: { creator: { select: { id: true, email: true } } },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search ? { description: { contains: search } } : {};

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where, skip, take: limit,
        include: { creator: { select: { id: true, email: true } } },
        orderBy: { expenseDate: 'desc' },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async getStats(dateFrom?: string, dateTo?: string) {
    const where: any = {};
    if (dateFrom || dateTo) {
      where.expenseDate = {};
      if (dateFrom) where.expenseDate.gte = new Date(dateFrom);
      if (dateTo) where.expenseDate.lte = new Date(dateTo);
    }

    const byCategory = await this.prisma.expense.groupBy({
      by: ['category'],
      where,
      _sum: { amount: true },
      _count: true,
    });

    const total = await this.prisma.expense.aggregate({
      where,
      _sum: { amount: true },
    });

    return { total: total._sum.amount || 0, byCategory };
  }

  async findOne(id: number) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { creator: { select: { id: true, email: true } } },
    });
    if (!expense) throw new NotFoundException('المصروف غير موجود');
    return expense;
  }

  async update(id: number, dto: UpdateExpenseDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.expenseDate) data.expenseDate = new Date(dto.expenseDate);

    return this.prisma.expense.update({
      where: { id }, data,
      include: { creator: { select: { id: true, email: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.expense.delete({ where: { id } });
    return { message: 'تم حذف المصروف بنجاح' };
  }
}