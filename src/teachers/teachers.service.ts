// src/teachers/teachers.service.ts
// خدمة إدارة المعلمين

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherDto: CreateTeacherDto) {
    const data: any = { ...createTeacherDto };
    if (data.hireDate) {
      data.hireDate = new Date(data.hireDate);
    }

    return this.prisma.teacher.create({
      data,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { specialization: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          gradeSubjects: {
            include: {
              grade: true,
              subject: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.teacher.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
        gradeSubjects: {
          include: {
            grade: true,
            subject: true,
            schedules: {
              include: { section: true },
            },
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('المعلم غير موجود');
    }

    return teacher;
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    await this.findOne(id);
    const data: any = { ...updateTeacherDto };
    if (data.hireDate) {
      data.hireDate = new Date(data.hireDate);
    }

    return this.prisma.teacher.update({
      where: { id },
      data,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.teacher.delete({ where: { id } });
    return { message: 'تم حذف المعلم بنجاح' };
  }
}