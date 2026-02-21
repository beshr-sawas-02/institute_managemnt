// src/sections/sections.service.ts
// خدمة إدارة الشعب

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto) {
    return this.prisma.section.create({
      data: createSectionDto,
      include: { grade: true },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search ? { name: { contains: search } } : {};

    const [data, total] = await Promise.all([
      this.prisma.section.findMany({
        where,
        skip,
        take: limit,
        include: {
          grade: true,
          _count: { select: { students: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.section.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: {
        grade: true,
        students: { where: { status: 'active' } },
        schedules: {
          include: {
            gradeSubject: { include: { subject: true, teacher: true } },
          },
        },
      },
    });

    if (!section) throw new NotFoundException('الشعبة غير موجودة');
    return section;
  }

  async findByGrade(gradeId: number) {
    return this.prisma.section.findMany({
      where: { gradeId, status: 'active' },
      include: {
        grade: true,
        _count: { select: { students: true } },
      },
    });
  }

  async update(id: number, updateSectionDto: UpdateSectionDto) {
    await this.findOne(id);
    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
      include: { grade: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.section.delete({ where: { id } });
    return { message: 'تم حذف الشعبة بنجاح' };
  }
}