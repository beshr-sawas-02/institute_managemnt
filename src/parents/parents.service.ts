import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto, UpdateParentDto } from './dto/parent.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, createParentDto: CreateParentDto) {
    await this.ensureUserBelongsToOrg(orgId, createParentDto.userId);
    return this.prisma.parent.create({
      data: { ...createParentDto, organizationId: orgId },
      include: { user: { select: { id: true, email: true, role: true } } },
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
        { phone: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.parent.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          students: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.parent.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(orgId: number, id: number) {
    const parent = await this.prisma.parent.findFirst({
      where: { id, organizationId: orgId },
      include: {
        user: { select: { id: true, email: true } },
        students: {
          include: { section: { include: { grade: true } } },
        },
      },
    });

    if (!parent) throw new NotFoundException('ولي الأمر غير موجود');
    return parent;
  }

  async update(orgId: number, id: number, updateParentDto: UpdateParentDto) {
    await this.findOne(orgId, id);
    await this.ensureUserBelongsToOrg(orgId, updateParentDto.userId);
    return this.prisma.parent.update({
      where: { id },
      data: updateParentDto,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  private async ensureUserBelongsToOrg(orgId: number, userId?: number) {
    if (userId === undefined) return;
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId: orgId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('المستخدم غير موجود');
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.parent.delete({ where: { id } });
    return { message: 'تم حذف ولي الأمر بنجاح' };
  }
}
