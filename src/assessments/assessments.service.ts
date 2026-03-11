// src/assessments/assessments.service.ts
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
        gradeSubject: { include: { subject: true } },
      },
    });

    if (dto.score !== undefined && assessment.student?.parent?.userId) {
      const subjectName = assessment.gradeSubject?.subject?.name || '';
      await this.notificationsService.notifyNewAssessment(
        dto.studentId,
        dto.title,
        dto.score,
        dto.maxScore,
        subjectName,
        assessment.id,
      );
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
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.assessmentDate) data.assessmentDate = new Date(dto.assessmentDate);
    if (dto.score !== undefined && dto.maxScore) {
      data.percentage = (dto.score / dto.maxScore) * 100;
      data.grade = this.calculateGrade(data.percentage);
    }

    return this.prisma.assessment.update({
      where: { id },
      data,
      include: { student: true, gradeSubject: { include: { subject: true } } },
    });
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