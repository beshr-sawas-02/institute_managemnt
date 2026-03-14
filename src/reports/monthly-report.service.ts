// src/reports/monthly-report.service.ts
// خدمة التقارير الشهرية للتقييمات

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

// ==================== أنواع التقارير ====================

export interface StudentReportAssessment {
  id: number;
  subject: string;
  teacher: string;
  type: string;
  title: string;
  maxScore: number;
  score: number | null;
  percentage: number | null;
  grade: string | null;
  date: Date;
  feedback: string | null;
}

export interface StudentReportSummary {
  totalAssessments: number;
  scoredAssessments: number;
  averagePercentage: number | null;
  overallGrade: string | null;
}

export interface StudentMonthlyReport {
  student: {
    id: number;
    name: string;
    section: string;
  };
  period: {
    month: number;
    year: number;
    monthName: string;
  };
  assessments: StudentReportAssessment[];
  summary: StudentReportSummary;
}

export interface SectionNotifyResult {
  message: string;
  reportId: number;
  totalStudents: number;
  notifiedParents: number;
  section: { id: number; name: string };
  period: { month: number; year: number; monthName: string };
}

export interface SectionNotifyError {
  section: { id: number; name: string };
  error: string;
}

@Injectable()
export class MonthlyReportService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) { }

  /**
   * إنشاء تقرير شهري لطالب واحد
   * يشمل فقط: midterm و final (بدون quiz و homework و exam)
   */
  async generateStudentMonthlyReport(
    studentId: number,
    month: number,
    year: number,
  ): Promise<StudentMonthlyReport> {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        parent: { include: { user: true } },
        section: { include: { grade: true } },
      },
    });

    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }

    // بداية ونهاية الشهر
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // جلب التقييمات (فقط midterm و final)
    const assessments = await this.prisma.assessment.findMany({
      where: {
        studentId,
        type: { in: ['midterm', 'final'] },
        assessmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        gradeSubject: {
          include: {
            subject: true,
            teacher: true,
          },
        },
      },
      orderBy: { assessmentDate: 'asc' },
    });

    // حساب المعدل العام
    const scoredAssessments = assessments.filter((a) => a.score !== null);
    const averagePercentage =
      scoredAssessments.length > 0
        ? scoredAssessments.reduce(
          (sum, a) => sum + Number(a.percentage || 0),
          0,
        ) / scoredAssessments.length
        : null;

    return {
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        section: student.section
          ? `${student.section.grade?.name} - ${student.section.name}`
          : 'غير محدد',
      },
      period: {
        month,
        year,
        monthName: this.getArabicMonthName(month),
      },
      assessments: assessments.map((a) => ({
        id: a.id,
        subject: a.gradeSubject?.subject?.name || 'غير محدد',
        teacher: a.gradeSubject?.teacher
          ? `${a.gradeSubject.teacher.firstName} ${a.gradeSubject.teacher.lastName}`
          : 'غير محدد',
        type: a.type === 'midterm' ? 'مذاكرة' : 'فحص نهائي',
        title: a.title,
        maxScore: Number(a.maxScore),
        score: a.score !== null ? Number(a.score) : null,
        percentage: a.percentage !== null ? Number(a.percentage) : null,
        grade: a.grade,
        date: a.assessmentDate,
        feedback: a.feedback,
      })),
      summary: {
        totalAssessments: assessments.length,
        scoredAssessments: scoredAssessments.length,
        averagePercentage: averagePercentage
          ? Math.round(averagePercentage * 100) / 100
          : null,
        overallGrade: averagePercentage
          ? this.calculateGrade(averagePercentage)
          : null,
      },
    };
  }

  /**
   * إنشاء تقارير شهرية لجميع طلاب شعبة معينة
   */
  async generateSectionMonthlyReports(
    sectionId: number,
    month: number,
    year: number,
  ) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { grade: true },
    });

    if (!section) {
      throw new NotFoundException('الشعبة غير موجودة');
    }

    const students = await this.prisma.student.findMany({
      where: { sectionId, status: 'active' },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    const reports: StudentMonthlyReport[] = [];
    for (const student of students) {
      const report = await this.generateStudentMonthlyReport(
        student.id,
        month,
        year,
      );
      reports.push(report);
    }

    return {
      section: {
        id: section.id,
        name: `${section.grade.name} - ${section.name}`,
      },
      period: {
        month,
        year,
        monthName: this.getArabicMonthName(month),
      },
      totalStudents: reports.length,
      reports,
    };
  }

  /**
   * إنشاء تقارير شهرية وإرسال إشعارات لأولياء الأمور
   */
  async generateAndNotifySectionReports(
    sectionId: number,
    month: number,
    year: number,
    generatedByUserId: number,
  ): Promise<SectionNotifyResult> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('الشهر يجب أن يكون بين 1 و 12');
    }

    const sectionReports = await this.generateSectionMonthlyReports(
      sectionId,
      month,
      year,
    );

    let notifiedCount = 0;
    const monthName = this.getArabicMonthName(month);

    for (const report of sectionReports.reports) {
      const student = await this.prisma.student.findUnique({
        where: { id: report.student.id },
        include: { parent: { include: { user: true } } },
      });

      if (student?.parent?.userId && report.assessments.length > 0) {
        let message = `📋 التقرير الشهري لـ ${report.student.name} - ${monthName} ${year}\n`;
        message += `📍 ${report.student.section}\n\n`;

        if (report.assessments.length > 0) {
          message += `📝 التقييمات:\n`;
          for (const assessment of report.assessments) {
            const scoreText =
              assessment.score !== null
                ? `${assessment.score}/${assessment.maxScore} (${assessment.percentage?.toFixed(0)}%)`
                : 'لم يُقيَّم بعد';
            message += `• ${assessment.subject} - ${assessment.type}: ${scoreText}`;
            if (assessment.grade) {
              message += ` - ${assessment.grade}`;
            }
            message += `\n`;
          }
        }

        if (report.summary.averagePercentage !== null) {
          message += `\n📊 المعدل العام: ${report.summary.averagePercentage.toFixed(1)}% - ${report.summary.overallGrade}`;
        }

        await this.notificationsService.create({
          userId: student.parent.userId,
          relatedId: report.student.id,
          relatedType: 'assessment',
          title: `تقرير شهري - ${report.student.name} - ${monthName}`,
          message,
          type: 'info',
          channel: 'push',
          data: {                          // ← جديد
            studentId: report.student.id,
            month,
            year,
          },
        });

        notifiedCount++;
      }
    }

    const savedReport = await this.prisma.report.create({
      data: {
        generatedBy: generatedByUserId,
        type: 'performance',
        title: `تقرير شهري - ${sectionReports.section.name} - ${monthName} ${year}`,
        parameters: { sectionId, month, year },
        data: sectionReports as any,
        format: 'json',
        periodStart: new Date(year, month - 1, 1),
        periodEnd: new Date(year, month, 0),
      },
    });

    return {
      message: `تم إنشاء التقرير الشهري وإرسال ${notifiedCount} إشعار لأولياء الأمور`,
      reportId: savedReport.id,
      totalStudents: sectionReports.totalStudents,
      notifiedParents: notifiedCount,
      section: sectionReports.section,
      period: sectionReports.period,
    };
  }

  /**
   * إنشاء تقارير شهرية لجميع الشعب وإرسال إشعارات
   */
  async generateAndNotifyAllSections(
    month: number,
    year: number,
    generatedByUserId: number,
  ) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('الشهر يجب أن يكون بين 1 و 12');
    }

    const sections = await this.prisma.section.findMany({
      where: { status: 'active' },
      select: { id: true, name: true, grade: { select: { name: true } } },
    });

    const results: (SectionNotifyResult | SectionNotifyError)[] = [];
    let totalNotified = 0;

    for (const section of sections) {
      try {
        const result = await this.generateAndNotifySectionReports(
          section.id,
          month,
          year,
          generatedByUserId,
        );
        results.push(result);
        totalNotified += result.notifiedParents;
      } catch (error) {
        console.error(
          `خطأ في إنشاء تقرير الشعبة ${section.grade.name} - ${section.name}:`,
          error,
        );
        results.push({
          section: { id: section.id, name: `${section.grade.name} - ${section.name}` },
          error: 'فشل في إنشاء التقرير',
        });
      }
    }

    return {
      message: `تم إنشاء التقارير الشهرية لـ ${sections.length} شعبة وإرسال ${totalNotified} إشعار`,
      totalSections: sections.length,
      totalNotified,
      monthName: this.getArabicMonthName(month),
      year,
      results,
    };
  }

  // ==================== دوال مساعدة ====================

  private getArabicMonthName(month: number): string {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    ];
    return months[month - 1] || '';
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'ممتاز';
    if (percentage >= 80) return 'جيد جداً';
    if (percentage >= 70) return 'جيد';
    if (percentage >= 60) return 'مقبول';
    if (percentage >= 50) return 'ضعيف';
    return 'راسب';
  }
}