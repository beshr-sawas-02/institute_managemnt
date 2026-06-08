import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async getAvailableBalance(orgId: number): Promise<number> {
    const [totalPaid, totalExpenses] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: 'paid', organizationId: orgId },
        _sum: { finalAmount: true },
      }),
      this.prisma.expense.aggregate({
        where: { organizationId: orgId },
        _sum: { amount: true },
      }),
    ]);

    const paid = Number(totalPaid._sum.finalAmount) || 0;
    const expenses = Number(totalExpenses._sum.amount) || 0;
    return paid - expenses;
  }

  async create(orgId: number, userId: number, dto: CreateExpenseDto) {
    const availableBalance = await this.getAvailableBalance(orgId);

    if (dto.amount > availableBalance) {
      throw new BadRequestException(
        `لا يمكن إضافة هذا المصروف. الرصيد المتاح: ${availableBalance.toFixed(2)}، والمبلغ المطلوب: ${dto.amount}`,
      );
    }

    return this.prisma.expense.create({
      data: {
        ...dto,
        organizationId: orgId,
        createdBy: userId,
        expenseDate: new Date(dto.expenseDate),
      },
      include: { creator: { select: { id: true, email: true } } },
    });
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (search) where.description = { contains: search };

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip,
        take: limit,
        include: { creator: { select: { id: true, email: true } } },
        orderBy: { expenseDate: 'desc' },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async getStats(orgId: number, dateFrom?: string, dateTo?: string) {
    const where: any = { organizationId: orgId };
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

    const availableBalance = await this.getAvailableBalance(orgId);

    return {
      total: total._sum.amount || 0,
      byCategory,
      availableBalance,
    };
  }

  async findOne(orgId: number, id: number) {
    const expense = await this.prisma.expense.findFirst({
      where: { id, organizationId: orgId },
      include: { creator: { select: { id: true, email: true } } },
    });
    if (!expense) throw new NotFoundException('المصروف غير موجود');
    return expense;
  }

  async update(orgId: number, id: number, dto: UpdateExpenseDto) {
    const existing = await this.findOne(orgId, id);

    if (dto.amount !== undefined && dto.amount !== Number(existing.amount)) {
      const availableBalance = await this.getAvailableBalance(orgId);
      const diff = dto.amount - Number(existing.amount);
      if (diff > availableBalance) {
        throw new BadRequestException(
          `لا يمكن تحديث هذا المصروف. الرصيد المتاح: ${availableBalance.toFixed(2)}`,
        );
      }
    }

    const data: any = { ...dto };
    if (dto.expenseDate) data.expenseDate = new Date(dto.expenseDate);

    return this.prisma.expense.update({
      where: { id },
      data,
      include: { creator: { select: { id: true, email: true } } },
    });
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.expense.delete({ where: { id } });
    return { message: 'تم حذف المصروف بنجاح' };
  }
}
