// src/reports/reports.service.ts
// خدمة إنشاء التقارير

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/report.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // إنشاء تقرير جديد
  async create(userId: number, dto: CreateReportDto) {
    let reportData: any = {};

    // جمع بيانات التقرير حسب النوع
    switch (dto.type) {
      case 'attendance':
        reportData = await this.generateAttendanceReport(dto);
        break;
      case 'financial':
        reportData = await this.generateFinancialReport(dto);
        break;
      case 'performance':
        reportData = await this.generatePerformanceReport(dto);
        break;
      case 'comparison':
        reportData = await this.generateComparisonReport(dto);
        break;
    }

    return this.prisma.report.create({
      data: {
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

  // تقرير الحضور
  private async generateAttendanceReport(dto: CreateReportDto) {
    const where: any = {};
    if (dto.periodStart) where.date = { ...where.date, gte: new Date(dto.periodStart) };
    if (dto.periodEnd) where.date = { ...where.date, lte: new Date(dto.periodEnd) };

    const stats = await this.prisma.attendance.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    const totalStudents = await this.prisma.student.count({ where: { status: 'active' } });

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

  // تقرير مالي
  private async generateFinancialReport(dto: CreateReportDto) {
    const paymentWhere: any = {};
    const expenseWhere: any = {};

    if (dto.periodStart) {
      paymentWhere.dueDate = { gte: new Date(dto.periodStart) };
      expenseWhere.expenseDate = { gte: new Date(dto.periodStart) };
    }
    if (dto.periodEnd) {
      paymentWhere.dueDate = { ...paymentWhere.dueDate, lte: new Date(dto.periodEnd) };
      expenseWhere.expenseDate = { ...expenseWhere.expenseDate, lte: new Date(dto.periodEnd) };
    }

    const [income, expenses, paymentsByStatus] = await Promise.all([
      this.prisma.payment.aggregate({ where: { ...paymentWhere, status: 'paid' }, _sum: { finalAmount: true } }),
      this.prisma.expense.aggregate({ where: expenseWhere, _sum: { amount: true } }),
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
      netProfit: (Number(income._sum.finalAmount) || 0) - (Number(expenses._sum.amount) || 0),
      paymentsByStatus,
      expensesByCategory,
      generatedAt: new Date().toISOString(),
    };
  }

  // تقرير الأداء
  private async generatePerformanceReport(dto: CreateReportDto) {
    const where: any = {};
    if (dto.periodStart) where.assessmentDate = { gte: new Date(dto.periodStart) };
    if (dto.periodEnd) where.assessmentDate = { ...where.assessmentDate, lte: new Date(dto.periodEnd) };

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

  // تقرير مقارنة
  private async generateComparisonReport(dto: CreateReportDto) {
    const sections = await this.prisma.section.findMany({
      where: { status: 'active' },
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

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        skip, take: limit,
        include: { generator: { select: { id: true, email: true } } },
        orderBy: { generatedAt: 'desc' },
      }),
      this.prisma.report.count(),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: { generator: { select: { id: true, email: true } } },
    });
    if (!report) throw new NotFoundException('التقرير غير موجود');
    return report;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.report.delete({ where: { id } });
    return { message: 'تم حذف التقرير بنجاح' };
  }
}