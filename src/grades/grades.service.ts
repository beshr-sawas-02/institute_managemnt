// src/grades/grades.service.ts
// خدمة إدارة الصفوف

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto, UpdateGradeDto } from './dto/grade.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(createGradeDto: CreateGradeDto) {
    return this.prisma.grade.create({ data: createGradeDto });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search ? { name: { contains: search } } : {};

    const [data, total] = await Promise.all([
      this.prisma.grade.findMany({
        where,
        skip,
        take: limit,
        include: {
          sections: { where: { status: 'active' } },
          gradeSubjects: { include: { subject: true, teacher: true } },
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.grade.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const grade = await this.prisma.grade.findUnique({
      where: { id },
      include: {
        sections: {
          include: { students: { where: { status: 'active' } } },
        },
        gradeSubjects: {
          include: { subject: true, teacher: true },
        },
      },
    });

    if (!grade) throw new NotFoundException('الصف غير موجود');
    return grade;
  }

  async update(id: number, updateGradeDto: UpdateGradeDto) {
    await this.findOne(id);
    return this.prisma.grade.update({
      where: { id },
      data: updateGradeDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.grade.delete({ where: { id } });
    return { message: 'تم حذف الصف بنجاح' };
  }
}