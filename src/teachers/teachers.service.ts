import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, createTeacherDto: CreateTeacherDto) {
    const data: any = { ...createTeacherDto, organizationId: orgId };
    if (data.hireDate) data.hireDate = new Date(data.hireDate);

    return this.prisma.teacher.create({
      data,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { specialization: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          gradeSubjects: { include: { grade: true, subject: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.teacher.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(orgId: number, id: number) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id, organizationId: orgId },
      include: {
        user: { select: { id: true, email: true } },
        gradeSubjects: {
          include: {
            grade: true,
            subject: true,
            schedules: { include: { section: true } },
          },
        },
      },
    });

    if (!teacher) throw new NotFoundException('المعلم غير موجود');
    return teacher;
  }

  async update(orgId: number, id: number, updateTeacherDto: UpdateTeacherDto) {
    await this.findOne(orgId, id);
    const data: any = { ...updateTeacherDto };
    if (data.hireDate) data.hireDate = new Date(data.hireDate);

    return this.prisma.teacher.update({
      where: { id },
      data,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.teacher.delete({ where: { id } });
    return { message: 'تم حذف المعلم بنجاح' };
  }
}
