import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, createSectionDto: CreateSectionDto) {
    await this.ensureGradeBelongsToOrg(orgId, createSectionDto.gradeId);
    return this.prisma.section.create({
      data: { ...createSectionDto, organizationId: orgId },
      include: { grade: true },
    });
  }

  async findAll(orgId: number, paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = { organizationId: orgId };
    if (search) where.name = { contains: search };

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

  async findOne(orgId: number, id: number) {
    const section = await this.prisma.section.findFirst({
      where: { id, organizationId: orgId },
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

  async findByGrade(orgId: number, gradeId: number) {
    return this.prisma.section.findMany({
      where: { gradeId, organizationId: orgId, status: 'active' },
      include: {
        grade: true,
        _count: { select: { students: true } },
      },
    });
  }

  async update(orgId: number, id: number, updateSectionDto: UpdateSectionDto) {
    await this.findOne(orgId, id);
    if (updateSectionDto.gradeId !== undefined) {
      await this.ensureGradeBelongsToOrg(orgId, updateSectionDto.gradeId);
    }
    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
      include: { grade: true },
    });
  }

  private async ensureGradeBelongsToOrg(orgId: number, gradeId: number) {
    const grade = await this.prisma.grade.findFirst({
      where: { id: gradeId, organizationId: orgId },
      select: { id: true },
    });
    if (!grade) throw new NotFoundException('الصف غير موجود');
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.section.delete({ where: { id } });
    return { message: 'تم حذف الشعبة بنجاح' };
  }
}
