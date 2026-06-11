import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceptionDto, UpdateReceptionDto } from './dto/reception.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ReceptionService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, createReceptionDto: CreateReceptionDto) {
    await this.ensureUserBelongsToOrg(orgId, createReceptionDto.userId);
    return this.prisma.reception.create({
      data: { ...createReceptionDto, organizationId: orgId },
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
        { email: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.reception.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { id: true, email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.reception.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(orgId: number, id: number) {
    const reception = await this.prisma.reception.findFirst({
      where: { id, organizationId: orgId },
      include: { user: { select: { id: true, email: true, role: true } } },
    });

    if (!reception) throw new NotFoundException('Reception not found');
    return reception;
  }

  async update(
    orgId: number,
    id: number,
    updateReceptionDto: UpdateReceptionDto,
  ) {
    await this.findOne(orgId, id);
    await this.ensureUserBelongsToOrg(orgId, updateReceptionDto.userId);
    return this.prisma.reception.update({
      where: { id },
      data: updateReceptionDto,
      include: { user: { select: { id: true, email: true, role: true } } },
    });
  }

  private async ensureUserBelongsToOrg(orgId: number, userId?: number) {
    if (userId === undefined) return;
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId: orgId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.reception.delete({ where: { id } });
    return { message: 'Reception deleted successfully' };
  }
}
