// src/subjects/subjects.service.ts
// خدمة إدارة المواد الدراسية

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({ data: dto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;
    const where = search ? { name: { contains: search } } : {};

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where, skip, take: limit,
        include: { gradeSubjects: { include: { grade: true, teacher: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.subject.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: { gradeSubjects: { include: { grade: true, teacher: true } } },
    });
    if (!subject) throw new NotFoundException('المادة غير موجودة');
    return subject;
  }

  async update(id: number, dto: UpdateSubjectDto) {
    await this.findOne(id);
    return this.prisma.subject.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.subject.delete({ where: { id } });
    return { message: 'تم حذف المادة بنجاح' };
  }
}