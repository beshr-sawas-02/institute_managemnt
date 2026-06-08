import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, dto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: { ...dto, organizationId: orgId },
    });
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (search) where.name = { contains: search };

    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        skip,
        take: limit,
        include: { gradeSubjects: { include: { grade: true, teacher: true } } },
        orderBy: { name: 'asc' },
      }),
      this.prisma.subject.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(orgId: number, id: number) {
    const subject = await this.prisma.subject.findFirst({
      where: { id, organizationId: orgId },
      include: { gradeSubjects: { include: { grade: true, teacher: true } } },
    });

    if (!subject) throw new NotFoundException('المادة غير موجودة');
    return subject;
  }

  async update(orgId: number, id: number, dto: UpdateSubjectDto) {
    await this.findOne(orgId, id);
    return this.prisma.subject.update({ where: { id }, data: dto });
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.subject.delete({ where: { id } });
    return { message: 'تم حذف المادة بنجاح' };
  }
}
