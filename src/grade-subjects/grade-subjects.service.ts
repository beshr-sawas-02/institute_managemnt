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
    const grade = await this.prisma.grade.findFirst({
      where: { id: dto.gradeId, organizationId: orgId },
    });
    if (!grade) throw new NotFoundException('الصف غير موجود');

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
    return this.prisma.gradeSubject.update({
      where: { id },
      data: dto,
      include: { grade: true, subject: true, teacher: true },
    });
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.gradeSubject.delete({ where: { id } });
    return { message: 'تم حذف ربط المادة بالصف بنجاح' };
  }
}
