// src/students/students.service.ts
// خدمة إدارة الطلاب

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const data: any = { ...createStudentDto };
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    return this.prisma.student.create({
      data,
      include: {
        parent: { select: { id: true, firstName: true, lastName: true } },
        section: { include: { grade: true } },
      },
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
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          parent: { select: { id: true, firstName: true, lastName: true, phone: true } },
          section: { include: { grade: true } },
          user: { select: { id: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        parent: true,
        section: { include: { grade: true } },
        user: { select: { id: true, email: true } },
        attendances: {
          take: 10,
          orderBy: { date: 'desc' },
        },
        assessments: {
          take: 10,
          orderBy: { assessmentDate: 'desc' },
          include: { gradeSubject: { include: { subject: true } } },
        },
        payments: { orderBy: { dueDate: 'desc' } },
      },
    });

    if (!student) {
      throw new NotFoundException('الطالب غير موجود');
    }
    return student;
  }

  async findBySection(sectionId: number) {
    return this.prisma.student.findMany({
      where: { sectionId, status: 'active' },
      include: {
        parent: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
      orderBy: { firstName: 'asc' },
    });
  }

  async findByParent(parentId: number) {
    return this.prisma.student.findMany({
      where: { parentId },
      include: { section: { include: { grade: true } } },
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id);
    const data: any = { ...updateStudentDto };
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    return this.prisma.student.update({
      where: { id },
      data,
      include: {
        parent: { select: { id: true, firstName: true, lastName: true } },
        section: { include: { grade: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.student.delete({ where: { id } });
    return { message: 'تم حذف الطالب بنجاح' };
  }
}