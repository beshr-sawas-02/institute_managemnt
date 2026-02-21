// src/grade-subjects/grade-subjects.service.ts
// خدمة إدارة مواد الصفوف (ربط المواد بالصفوف والمعلمين)

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeSubjectDto, UpdateGradeSubjectDto } from './dto/grade-subject.dto';

@Injectable()
export class GradeSubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGradeSubjectDto) {
    // التحقق من عدم وجود نفس الربط مسبقاً
    const existing = await this.prisma.gradeSubject.findFirst({
      where: { gradeId: dto.gradeId, subjectId: dto.subjectId },
    });
    if (existing) throw new ConflictException('هذه المادة مربوطة بالصف بالفعل');

    return this.prisma.gradeSubject.create({
      data: dto,
      include: { grade: true, subject: true, teacher: true },
    });
  }

  async findAll() {
    return this.prisma.gradeSubject.findMany({
      include: { grade: true, subject: true, teacher: true },
      orderBy: { gradeId: 'asc' },
    });
  }

  async findByGrade(gradeId: number) {
    return this.prisma.gradeSubject.findMany({
      where: { gradeId },
      include: { subject: true, teacher: true },
    });
  }

  async findByTeacher(teacherId: number) {
    return this.prisma.gradeSubject.findMany({
      where: { teacherId },
      include: { grade: true, subject: true },
    });
  }

  async findOne(id: number) {
    const gs = await this.prisma.gradeSubject.findUnique({
      where: { id },
      include: { grade: true, subject: true, teacher: true, schedules: true },
    });
    if (!gs) throw new NotFoundException('مادة الصف غير موجودة');
    return gs;
  }

  async update(id: number, dto: UpdateGradeSubjectDto) {
    await this.findOne(id);
    return this.prisma.gradeSubject.update({
      where: { id },
      data: dto,
      include: { grade: true, subject: true, teacher: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.gradeSubject.delete({ where: { id } });
    return { message: 'تم حذف ربط المادة بالصف بنجاح' };
  }
}