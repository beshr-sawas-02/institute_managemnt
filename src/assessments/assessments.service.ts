// src/assessments/assessments.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  buildAssessmentCreatedNotification,
  buildAssessmentResultNotification,
  buildAssessmentScoreUpdatedNotification,
} from '../notifications/notification-localization';
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

    if (assessment.student?.parent?.user) {
      const subjectName = assessment.gradeSubject?.subject?.name || 'غير محدد';
      const studentName = `${assessment.student.firstName} ${assessment.student.lastName}`;
      const teacherName = assessment.gradeSubject?.teacher
        ? `${assessment.gradeSubject.teacher.firstName} ${assessment.gradeSubject.teacher.lastName}`
        : undefined;

      const content =
        dto.score !== undefined && dto.score !== null && percentage !== null
          ? buildAssessmentResultNotification({
              studentName,
              subjectName,
              assessmentType: dto.type,
              assessmentTitle: dto.title,
              maxScore: dto.maxScore,
              score: dto.score,
              percentage,
              grade,
              teacherName,
              feedback: dto.feedback,
            })
          : buildAssessmentCreatedNotification({
              studentName,
              subjectName,
              assessmentType: dto.type,
              assessmentTitle: dto.title,
              maxScore: dto.maxScore,
              teacherName,
            });

      await this.notificationsService.createLocalizedNotification({
        userId: assessment.student.parent.user.id,
        preferredLanguage: assessment.student.parent.user.preferredLanguage,
        relatedId: assessment.id,
        relatedType: 'assessment',
        type:
          dto.score !== undefined && dto.score !== null && percentage !== null
            ? (percentage >= 50 ? 'success' : 'warning')
            : 'info',
        channel: 'push',
        content,
      });
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

    if (!assessment) {
      throw new NotFoundException('التقييم غير موجود');
    }

    return assessment;
  }

  async update(id: number, dto: UpdateAssessmentDto) {
    const existing = await this.findOne(id);
    const data: any = { ...dto };

    if (dto.assessmentDate) {
      data.assessmentDate = new Date(dto.assessmentDate);
    }

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

    if (
      dto.score !== undefined &&
      dto.score !== null &&
      Number(existing.score) !== dto.score &&
      updated.student?.parent?.user &&
      newPercentage !== null
    ) {
      const subjectName = updated.gradeSubject?.subject?.name || 'غير محدد';
      const studentName = `${updated.student.firstName} ${updated.student.lastName}`;
      const wasUnscored = existing.score === null;

      const content = buildAssessmentScoreUpdatedNotification({
        studentName,
        subjectName,
        assessmentType: updated.type,
        assessmentTitle: updated.title,
        maxScore: Number(updated.maxScore),
        score: dto.score,
        percentage: newPercentage,
        grade: newGrade || updated.grade,
        wasUnscored,
      });

      await this.notificationsService.createLocalizedNotification({
        userId: updated.student.parent.user.id,
        preferredLanguage: updated.student.parent.user.preferredLanguage,
        relatedId: updated.id,
        relatedType: 'assessment',
        type: newPercentage >= 50 ? 'success' : 'warning',
        channel: 'push',
        content,
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
}
