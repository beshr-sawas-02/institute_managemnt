import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const discount = dto.discount || 0;
    const finalAmount = dto.amount - discount;
    const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const payment = await this.prisma.payment.create({
      data: {
        ...dto,
        discount,
        finalAmount,
        receiptNumber,
        dueDate: new Date(dto.dueDate),
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
      },
      include: {
        student: { include: { parent: { include: { user: true } } } },
      },
    });

    // إشعار ولي الأمر بالمستحق الجديد
    if (payment.student?.parent?.userId) {
      await this.notificationsService.notifyNewPayment(
        dto.studentId,
        finalAmount,
        dto.dueDate,
        payment.id,
      );
    }

    return payment;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { receiptNumber: { contains: search } },
            { student: { firstName: { contains: search } } },
            { student: { lastName: { contains: search } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where, skip, take: limit,
        include: { student: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findByStudent(studentId: number) {
    return this.prisma.payment.findMany({
      where: { studentId },
      orderBy: { dueDate: 'desc' },
    });
  }

  async getStats(academicYear?: string) {
    const where = academicYear ? { academicYear } : {};

    const [totalPaid, totalPending, totalPartial] = await Promise.all([
      this.prisma.payment.aggregate({ where: { ...where, status: 'paid' }, _sum: { finalAmount: true } }),
      this.prisma.payment.aggregate({ where: { ...where, status: 'pending' }, _sum: { finalAmount: true } }),
      this.prisma.payment.aggregate({ where: { ...where, status: 'partial' }, _sum: { finalAmount: true } }),
    ]);

    return {
      totalPaid: totalPaid._sum.finalAmount || 0,
      totalPending: totalPending._sum.finalAmount || 0,
      totalPartial: totalPartial._sum.finalAmount || 0,
    };
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { student: { include: { parent: true } } },
    });
    if (!payment) throw new NotFoundException('الدفعة غير موجودة');
    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const current = await this.findOne(id);
    const data: any = { ...dto };
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    if (dto.paymentDate) data.paymentDate = new Date(dto.paymentDate);
    if (dto.amount !== undefined || dto.discount !== undefined) {
      const amount = dto.amount ?? Number(current.amount);
      const discount = dto.discount ?? Number(current.discount);
      data.finalAmount = amount - discount;
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data,
      include: { student: { include: { parent: { include: { user: true } } } } },
    });

    // إشعار عند تأكيد الدفع (تغيير الحالة إلى paid)
    if (dto.status === 'paid' && current.status !== 'paid') {
      if (updated.student?.parent?.userId) {
        await this.notificationsService.notifyPaymentConfirmed(
          updated.studentId,
          Number(updated.finalAmount),
          updated.receiptNumber || '',
          updated.id,
        );
      }
    }

    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.payment.delete({ where: { id } });
    return { message: 'تم حذف الدفعة بنجاح' };
  }
}