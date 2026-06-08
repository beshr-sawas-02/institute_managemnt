import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/report.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, userId: number, dto: CreateReportDto) {
    let reportData: any = {};

    switch (dto.type) {
      case 'attendance':
        reportData = await this.generateAttendanceReport(orgId, dto);
        break;
      case 'financial':
        reportData = await this.generateFinancialReport(orgId, dto);
        break;
      case 'performance':
        reportData = await this.generatePerformanceReport(orgId, dto);
        break;
      case 'comparison':
        reportData = await this.generateComparisonReport(orgId, dto);
        break;
    }

    return this.prisma.report.create({
      data: {
        organizationId: orgId,
        generatedBy: userId,
        type: dto.type,
        title: dto.title,
        parameters: dto.parameters || {},
        data: reportData,
        format: dto.format || 'json',
        periodStart: dto.periodStart ? new Date(dto.periodStart) : null,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : null,
      },
      include: { generator: { select: { id: true, email: true } } },
    });
  }

  private async generateAttendanceReport(orgId: number, dto: CreateReportDto) {
    const where: any = {};
    if (dto.periodStart) where.date = { gte: new Date(dto.periodStart) };
    if (dto.periodEnd)
      where.date = { ...where.date, lte: new Date(dto.periodEnd) };

    const stats = await this.prisma.attendance.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    const totalStudents = await this.prisma.student.count({
      where: { status: 'active', organizationId: orgId },
    });

    const topAbsentees = await this.prisma.attendance.groupBy({
      by: ['studentId'],
      where: { ...where, status: 'absent' },
      _count: true,
      orderBy: { _count: { studentId: 'desc' } },
      take: 10,
    });

    return {
      summary: stats,
      totalStudents,
      topAbsentees,
      generatedAt: new Date().toISOString(),
    };
  }

  private async generateFinancialReport(orgId: number, dto: CreateReportDto) {
    const paymentWhere: any = { organizationId: orgId };
    const expenseWhere: any = { organizationId: orgId };

    if (dto.periodStart) {
      paymentWhere.dueDate = { gte: new Date(dto.periodStart) };
      expenseWhere.expenseDate = { gte: new Date(dto.periodStart) };
    }
    if (dto.periodEnd) {
      paymentWhere.dueDate = {
        ...paymentWhere.dueDate,
        lte: new Date(dto.periodEnd),
      };
      expenseWhere.expenseDate = {
        ...expenseWhere.expenseDate,
        lte: new Date(dto.periodEnd),
      };
    }

    const [income, expenses, paymentsByStatus] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { ...paymentWhere, status: 'paid' },
        _sum: { finalAmount: true },
      }),
      this.prisma.expense.aggregate({
        where: expenseWhere,
        _sum: { amount: true },
      }),
      this.prisma.payment.groupBy({
        by: ['status'],
        where: paymentWhere,
        _sum: { finalAmount: true },
        _count: true,
      }),
    ]);

    const expensesByCategory = await this.prisma.expense.groupBy({
      by: ['category'],
      where: expenseWhere,
      _sum: { amount: true },
    });

    return {
      totalIncome: income._sum.finalAmount || 0,
      totalExpenses: expenses._sum.amount || 0,
      netProfit:
        (Number(income._sum.finalAmount) || 0) -
        (Number(expenses._sum.amount) || 0),
      paymentsByStatus,
      expensesByCategory,
      generatedAt: new Date().toISOString(),
    };
  }

  private async generatePerformanceReport(orgId: number, dto: CreateReportDto) {
    const where: any = {};
    if (dto.periodStart)
      where.assessmentDate = { gte: new Date(dto.periodStart) };
    if (dto.periodEnd)
      where.assessmentDate = {
        ...where.assessmentDate,
        lte: new Date(dto.periodEnd),
      };

    const avgScores = await this.prisma.assessment.groupBy({
      by: ['gradeSubjectId'],
      where,
      _avg: { percentage: true },
      _count: true,
    });

    const gradeDistribution = await this.prisma.assessment.groupBy({
      by: ['grade'],
      where,
      _count: true,
    });

    return {
      averageScores: avgScores,
      gradeDistribution,
      generatedAt: new Date().toISOString(),
    };
  }

  private async generateComparisonReport(orgId: number, dto: CreateReportDto) {
    const sections = await this.prisma.section.findMany({
      where: { status: 'active', organizationId: orgId },
      include: {
        grade: true,
        _count: { select: { students: true } },
      },
    });

    return {
      sections: sections.map((s) => ({
        id: s.id,
        name: `${s.grade.name} - ${s.name}`,
        studentCount: s._count.students,
      })),
      generatedAt: new Date().toISOString(),
    };
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where: { organizationId: orgId },
        skip,
        take: limit,
        include: { generator: { select: { id: true, email: true } } },
        orderBy: { generatedAt: 'desc' },
      }),
      this.prisma.report.count({ where: { organizationId: orgId } }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(orgId: number, id: number) {
    const report = await this.prisma.report.findFirst({
      where: { id, organizationId: orgId },
      include: { generator: { select: { id: true, email: true } } },
    });
    if (!report) throw new NotFoundException('التقرير غير موجود');
    return report;
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.report.delete({ where: { id } });
    return { message: 'تم حذف التقرير بنجاح' };
  }
}
