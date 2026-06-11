import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTuitionFeeDto,
  UpdateTuitionFeeDto,
} from './dto/tuition-fee.dto';

@Injectable()
export class TuitionFeesService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, userId: number, dto: CreateTuitionFeeDto) {
    await this.ensureGradeBelongsToOrg(orgId, dto.gradeId);
    const existing = await this.prisma.tuitionFee.findFirst({
      where: {
        gradeId: dto.gradeId,
        academicYear: dto.academicYear,
        organizationId: orgId,
      },
    });

    if (existing) {
      throw new ConflictException(
        'يوجد قسط مسجل لهذا الصف في هذه السنة الدراسية بالفعل',
      );
    }

    return this.prisma.tuitionFee.create({
      data: { ...dto, organizationId: orgId, createdBy: userId },
      include: {
        grade: { select: { id: true, name: true, level: true } },
        creator: { select: { id: true, email: true } },
      },
    });
  }

  async findAll(orgId: number, academicYear?: string) {
    const where: any = { organizationId: orgId };
    if (academicYear) where.academicYear = academicYear;

    return this.prisma.tuitionFee.findMany({
      where,
      include: {
        grade: { select: { id: true, name: true, level: true } },
        creator: { select: { id: true, email: true } },
      },
      orderBy: [{ academicYear: 'desc' }, { gradeId: 'asc' }],
    });
  }

  async findOne(orgId: number, id: number) {
    const fee = await this.prisma.tuitionFee.findFirst({
      where: { id, organizationId: orgId },
      include: {
        grade: { select: { id: true, name: true, level: true } },
        creator: { select: { id: true, email: true } },
      },
    });

    if (!fee) throw new NotFoundException('القسط غير موجود');
    return fee;
  }

  async findByGrade(orgId: number, gradeId: number, academicYear: string) {
    const fee = await this.prisma.tuitionFee.findFirst({
      where: { gradeId, academicYear, organizationId: orgId },
      include: { grade: { select: { id: true, name: true, level: true } } },
    });

    if (!fee)
      throw new NotFoundException(
        'لم يتم تحديد قسط لهذا الصف في هذه السنة الدراسية',
      );
    return fee;
  }

  async update(orgId: number, id: number, dto: UpdateTuitionFeeDto) {
    const current = await this.findOne(orgId, id);
    if (dto.gradeId !== undefined) {
      await this.ensureGradeBelongsToOrg(orgId, dto.gradeId);
    }

    if (dto.gradeId || dto.academicYear) {
      const gradeId = dto.gradeId ?? current.grade.id;
      const academicYear = dto.academicYear ?? current.academicYear;

      const conflict = await this.prisma.tuitionFee.findFirst({
        where: {
          gradeId,
          academicYear,
          organizationId: orgId,
          id: { not: id },
        },
      });

      if (conflict) {
        throw new ConflictException(
          'يوجد قسط مسجل لهذا الصف في هذه السنة الدراسية بالفعل',
        );
      }
    }

    return this.prisma.tuitionFee.update({
      where: { id },
      data: dto,
      include: { grade: { select: { id: true, name: true, level: true } } },
    });
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.tuitionFee.delete({ where: { id } });
    return { message: 'تم حذف القسط بنجاح' };
  }

  async getStudentBalance(
    orgId: number,
    studentId: number,
    academicYear: string,
  ) {
    const student = await this.prisma.student.findFirst({
      where: { id: studentId, organizationId: orgId },
      include: { section: { include: { grade: true } } },
    });

    if (!student?.section?.gradeId) return null;

    const tuitionFee = await this.prisma.tuitionFee.findFirst({
      where: {
        gradeId: student.section.gradeId,
        academicYear,
        organizationId: student.organizationId,
      },
    });

    if (!tuitionFee) return null;

    const paidAggregate = await this.prisma.payment.aggregate({
      where: { studentId, organizationId: orgId, status: 'paid' },
      _sum: { finalAmount: true },
    });

    const annualAmount = Number(tuitionFee.annualAmount);
    const totalPaid = Number(paidAggregate._sum.finalAmount) || 0;
    const remaining = annualAmount - totalPaid;

    return {
      annualAmount,
      totalPaid,
      remaining,
      gradeName: student.section.grade.name,
    };
  }

  private async ensureGradeBelongsToOrg(orgId: number, gradeId: number) {
    const grade = await this.prisma.grade.findFirst({
      where: { id: gradeId, organizationId: orgId },
      select: { id: true },
    });
    if (!grade) throw new NotFoundException('الصف غير موجود');
  }
}
