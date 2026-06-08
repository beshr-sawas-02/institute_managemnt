import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto, UpdateGradeDto } from './dto/grade.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, createGradeDto: CreateGradeDto) {
    return this.prisma.grade.create({
      data: { ...createGradeDto, organizationId: orgId },
    });
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (search) where.name = { contains: search };

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

  async findOne(orgId: number, id: number) {
    const grade = await this.prisma.grade.findFirst({
      where: { id, organizationId: orgId },
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

  async update(orgId: number, id: number, updateGradeDto: UpdateGradeDto) {
    await this.findOne(orgId, id);
    return this.prisma.grade.update({
      where: { id },
      data: updateGradeDto,
    });
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.grade.delete({ where: { id } });
    return { message: 'تم حذف الصف بنجاح' };
  }
}
