// src/assessments/assessments.service.ts
// خدمة التقييمات - محدّثة مع إشعارات فورية محسنة للأهل

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAssessmentDto, UpdateAssessmentDto } from './dto/assessment.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateAssessmentDto) {
    let percentage: number | null = null;
    let grade: string | null = null;

    if (dto.score !== undefined && dto.score !== null) {
      percentage = (dto.score / dto.maxScore) * 100;
      grade = this.calculateGrade(percentage);
    }

    const assessment = await this.prisma.assessment.create({
      data: {
        ...dto,
        assessmentDate: new Date(dto.assessmentDate),
        percentage,
        grade,
      },
      include: {
        student: { include: { parent: { include: { user: true } } } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
    });

    // ======= إشعار فوري لولي الأمر عند إضافة أي تقييم =======
    if (assessment.student?.parent?.userId) {
      const subjectName = assessment.gradeSubject?.subject?.name || 'غير محدد';
      const studentName = `${assessment.student.firstName} ${assessment.student.lastName}`;
      const teacherName = assessment.gradeSubject?.teacher
        ? `${assessment.gradeSubject.teacher.firstName} ${assessment.gradeSubject.teacher.lastName}`
        : '';

      const typeLabel = this.getAssessmentTypeLabel(dto.type);

      if (dto.score !== undefined && dto.score !== null) {
        // إذا فيه درجة - إشعار مع النتيجة
        const percentageValue = percentage!;
        const gradeValue = grade!;
        const notifType = percentageValue >= 50 ? 'success' : 'warning';

        let message = `حصل ${studentName} على ${dto.score}/${dto.maxScore} (${percentageValue.toFixed(0)}%) في ${typeLabel}: "${dto.title}" - مادة ${subjectName}`;
        message += `\n📊 التقدير: ${gradeValue}`;
        if (teacherName) {
          message += `\n👨‍🏫 المعلم: ${teacherName}`;
        }
        if (dto.feedback) {
          message += `\n💬 ملاحظة: ${dto.feedback}`;
        }

        await this.notificationsService.create({
          userId: assessment.student.parent.userId,
          relatedId: assessment.id,
          relatedType: 'assessment',
          title: `نتيجة ${typeLabel} - ${studentName} - ${subjectName}`,
          message,
          type: notifType as any,
          channel: 'push',
        });
      } else {
        // إذا ما فيه درجة بعد - إشعار بإنشاء التقييم
        let message = `تم إنشاء ${typeLabel} جديد لـ ${studentName} في مادة ${subjectName}: "${dto.title}"`;
        message += `\n📝 الدرجة العظمى: ${dto.maxScore}`;
        if (teacherName) {
          message += `\n👨‍🏫 المعلم: ${teacherName}`;
        }
        message += `\n⏳ لم تُسجَّل الدرجة بعد`;

        await this.notificationsService.create({
          userId: assessment.student.parent.userId,
          relatedId: assessment.id,
          relatedType: 'assessment',
          title: `${typeLabel} جديد - ${studentName} - ${subjectName}`,
          message,
          type: 'info',
          channel: 'push',
        });
      }
    }

    return assessment;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, sectionId, gradeSubjectId } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (sectionId) {
      where.student = { sectionId };
    }

    if (gradeSubjectId) {
      where.gradeSubjectId = gradeSubjectId;
    }

    const [data, total] = await Promise.all([
      this.prisma.assessment.findMany({
        skip,
        take: limit,
        where,
        include: {
          student: { select: { id: true, firstName: true, lastName: true } },
          gradeSubject: { include: { subject: true, grade: true } },
        },
        orderBy: { assessmentDate: 'desc' },
      }),
      this.prisma.assessment.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findByStudent(studentId: number) {
    return this.prisma.assessment.findMany({
      where: { studentId },
      include: { gradeSubject: { include: { subject: true } } },
      orderBy: { assessmentDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        student: true,
        gradeSubject: { include: { subject: true, grade: true, teacher: true } },
      },
    });
    if (!assessment) throw new NotFoundException('التقييم غير موجود');
    return assessment;
  }

  async update(id: number, dto: UpdateAssessmentDto) {
    const existing = await this.findOne(id);
    const data: any = { ...dto };
    if (dto.assessmentDate) data.assessmentDate = new Date(dto.assessmentDate);

    let newPercentage: number | null = null;
    let newGrade: string | null = null;

    if (dto.score !== undefined && dto.maxScore) {
      newPercentage = (dto.score / dto.maxScore) * 100;
      newGrade = this.calculateGrade(newPercentage);
      data.percentage = newPercentage;
      data.grade = newGrade;
    } else if (dto.score !== undefined && existing.maxScore) {
      newPercentage = (dto.score / Number(existing.maxScore)) * 100;
      newGrade = this.calculateGrade(newPercentage);
      data.percentage = newPercentage;
      data.grade = newGrade;
    }

    const updated = await this.prisma.assessment.update({
      where: { id },
      data,
      include: {
        student: { include: { parent: { include: { user: true } } } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
    });

    // ======= إشعار عند تحديث الدرجة =======
    // إذا تم تعديل الدرجة وكانت مختلفة عن القديمة
    if (
      dto.score !== undefined &&
      dto.score !== null &&
      Number(existing.score) !== dto.score &&
      updated.student?.parent?.userId
    ) {
      const subjectName = updated.gradeSubject?.subject?.name || 'غير محدد';
      const studentName = `${updated.student.firstName} ${updated.student.lastName}`;
      const typeLabel = this.getAssessmentTypeLabel(updated.type);
      const percentageValue = newPercentage || Number(updated.percentage);
      const gradeValue = newGrade || updated.grade;
      const notifType = percentageValue >= 50 ? 'success' : 'warning';

      const wasUnscored = existing.score === null;
      const titlePrefix = wasUnscored ? 'نتيجة' : 'تحديث نتيجة';

      let message = wasUnscored
        ? `حصل ${studentName} على ${dto.score}/${updated.maxScore} (${percentageValue.toFixed(0)}%) في ${typeLabel}: "${updated.title}" - مادة ${subjectName}`
        : `تم تحديث درجة ${studentName} في ${typeLabel}: "${updated.title}" - مادة ${subjectName}\nالدرجة الجديدة: ${dto.score}/${updated.maxScore} (${percentageValue.toFixed(0)}%)`;

      message += `\n📊 التقدير: ${gradeValue}`;

      await this.notificationsService.create({
        userId: updated.student.parent.userId,
        relatedId: updated.id,
        relatedType: 'assessment',
        title: `${titlePrefix} ${typeLabel} - ${studentName} - ${subjectName}`,
        message,
        type: notifType as any,
        channel: 'push',
      });
    }

    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.assessment.delete({ where: { id } });
    return { message: 'تم حذف التقييم بنجاح' };
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'ممتاز';
    if (percentage >= 80) return 'جيد جداً';
    if (percentage >= 70) return 'جيد';
    if (percentage >= 60) return 'مقبول';
    if (percentage >= 50) return 'ضعيف';
    return 'راسب';
  }

  private getAssessmentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      quiz: 'اختبار قصير',
      exam: 'اختبار',
      homework: 'واجب',
      midterm: 'مذاكرة',
      final: 'فحص نهائي',
    };
    return labels[type] || type;
  }
}