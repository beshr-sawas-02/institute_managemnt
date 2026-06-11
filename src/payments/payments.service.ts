import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TuitionFeesService } from '../tuition-fees/tuition-fees.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private tuitionFeesService: TuitionFeesService,
  ) {}

  async create(orgId: number, dto: CreatePaymentDto) {
    const discount = dto.discount || 0;
    const finalAmount = dto.amount - discount;
    const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    await this.ensureStudentBelongsToOrg(orgId, dto.studentId);

    const payment = await this.prisma.payment.create({
      data: {
        ...dto,
        currency: dto.currency ?? 'SYP',
        organizationId: orgId,
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

    if (payment.student.parent?.userId) {
      const balance = await this.tuitionFeesService.getStudentBalance(
        orgId,
        dto.studentId,
        dto.academicYear,
      );

      await this.notificationsService.notifyNewPaymentWithBalance(
        dto.studentId,
        finalAmount,
        dto.dueDate,
        payment.id,
        balance,
      );
    }

    return payment;
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (search) {
      where.OR = [
        { receiptNumber: { contains: search } },
        { student: { firstName: { contains: search } } },
        { student: { lastName: { contains: search } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findByStudent(orgId: number, studentId: number, academicYear?: string) {
    const payments = await this.prisma.payment.findMany({
      where: {
        organizationId: orgId,
        studentId,
        ...(academicYear ? { academicYear } : {}),
      },
      orderBy: { dueDate: 'desc' },
    });

    if (academicYear) {
      const balance = await this.tuitionFeesService.getStudentBalance(
        orgId,
        studentId,
        academicYear,
      );
      return { payments, balance: balance ?? null };
    }

    return { payments, balance: null };
  }

  async getStats(orgId: number, academicYear?: string) {
    const where: any = { organizationId: orgId };
    if (academicYear) where.academicYear = academicYear;

    const [totalPaid, totalPending, totalPartial] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { ...where, status: 'paid' },
        _sum: { finalAmount: true },
      }),
      this.prisma.payment.aggregate({
        where: { ...where, status: 'pending' },
        _sum: { finalAmount: true },
      }),
      this.prisma.payment.aggregate({
        where: { ...where, status: 'partial' },
        _sum: { finalAmount: true },
      }),
    ]);

    return {
      totalPaid: totalPaid._sum.finalAmount || 0,
      totalPending: totalPending._sum.finalAmount || 0,
      totalPartial: totalPartial._sum.finalAmount || 0,
    };
  }

  async findOne(orgId: number, id: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, organizationId: orgId },
      include: { student: { include: { parent: true } } },
    });
    if (!payment) throw new NotFoundException('الدفعة غير موجودة');
    return payment;
  }

  async update(orgId: number, id: number, dto: UpdatePaymentDto) {
    const current = await this.findOne(orgId, id);
    if (dto.studentId !== undefined) {
      await this.ensureStudentBelongsToOrg(orgId, dto.studentId);
    }
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
      include: {
        student: { include: { parent: { include: { user: true } } } },
      },
    });

    if (dto.status === 'paid' && current.status !== 'paid') {
      if (updated.student.parent?.userId) {
        const balance = await this.tuitionFeesService.getStudentBalance(
          orgId,
          updated.studentId,
          updated.academicYear,
        );

        await this.notificationsService.notifyPaymentConfirmedWithBalance(
          updated.studentId,
          Number(updated.finalAmount),
          updated.receiptNumber || '',
          updated.id,
          balance,
        );
      }
    }

    return updated;
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.payment.delete({ where: { id } });
    return { message: 'تم حذف الدفعة بنجاح' };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private async ensureStudentBelongsToOrg(
    orgId: number,
    studentId: number,
  ): Promise<void> {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, organizationId: orgId },
      select: { id: true },
    });
    if (!student) throw new NotFoundException('الطالب غير موجود');
  }
}
