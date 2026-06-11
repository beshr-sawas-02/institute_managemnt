import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateGradeSubjectDto,
  UpdateGradeSubjectDto,
} from './dto/grade-subject.dto';

@Injectable()
export class GradeSubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, dto: CreateGradeSubjectDto) {
    await this.validateRelations(orgId, dto);

    const existing = await this.prisma.gradeSubject.findFirst({
      where: {
        gradeId: dto.gradeId,
        subjectId: dto.subjectId,
        sectionId: dto.sectionId,
      },
    });
    if (existing) throw new ConflictException('هذه المادة مربوطة بالصف بالفعل');

    return this.prisma.gradeSubject.create({
      data: dto,
      include: { grade: true, subject: true, teacher: true },
    });
  }

  async findAll(orgId: number) {
    return this.prisma.gradeSubject.findMany({
      where: { grade: { organizationId: orgId } },
      include: { grade: true, subject: true, teacher: true },
      orderBy: { gradeId: 'asc' },
    });
  }

  async findByGrade(orgId: number, gradeId: number) {
    return this.prisma.gradeSubject.findMany({
      where: { gradeId, grade: { organizationId: orgId } },
      include: { subject: true, teacher: true },
    });
  }

  async findByTeacher(orgId: number, teacherId: number) {
    return this.prisma.gradeSubject.findMany({
      where: { teacherId, grade: { organizationId: orgId } },
      include: { grade: true, subject: true },
    });
  }

  async findOne(orgId: number, id: number) {
    const gs = await this.prisma.gradeSubject.findFirst({
      where: { id, grade: { organizationId: orgId } },
      include: { grade: true, subject: true, teacher: true, schedules: true },
    });
    if (!gs) throw new NotFoundException('مادة الصف غير موجودة');
    return gs;
  }

  async update(orgId: number, id: number, dto: UpdateGradeSubjectDto) {
    await this.findOne(orgId, id);
    await this.validateRelations(orgId, dto);
    return this.prisma.gradeSubject.update({
      where: { id },
      data: dto,
      include: { grade: true, subject: true, teacher: true },
    });
  }

  private async validateRelations(orgId: number, dto: UpdateGradeSubjectDto) {
    const checks: Promise<unknown>[] = [];
    if (dto.gradeId !== undefined) {
      checks.push(
        this.prisma.grade.findFirst({
          where: { id: dto.gradeId, organizationId: orgId },
          select: { id: true },
        }),
      );
    }
    if (dto.subjectId !== undefined) {
      checks.push(
        this.prisma.subject.findFirst({
          where: { id: dto.subjectId, organizationId: orgId },
          select: { id: true },
        }),
      );
    }
    if (dto.teacherId !== undefined) {
      checks.push(
        this.prisma.teacher.findFirst({
          where: { id: dto.teacherId, organizationId: orgId },
          select: { id: true },
        }),
      );
    }
    if (dto.sectionId !== undefined && dto.sectionId !== null) {
      checks.push(
        this.prisma.section.findFirst({
          where: { id: dto.sectionId, organizationId: orgId },
          select: { id: true },
        }),
      );
    }

    const results = await Promise.all(checks);
    if (results.some((result) => !result)) {
      throw new NotFoundException('إحدى البيانات المرتبطة لا تتبع هذه المؤسسة');
    }
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.gradeSubject.delete({ where: { id } });
    return { message: 'تم حذف ربط المادة بالصف بنجاح' };
  }
}
