import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('هذا المعرف مستخدم بالفعل');
    }

    return this.prisma.organization.create({
      data: dto,
      include: { subscriptions: true },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        include: {
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { users: true, students: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        subscriptions: { orderBy: { createdAt: 'desc' } },
        _count: {
          select: { users: true, students: true, teachers: true },
        },
      },
    });

    if (!org) throw new NotFoundException('المؤسسة غير موجودة');
    return org;
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.organization.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (existing) throw new ConflictException('هذا المعرف مستخدم بالفعل');
    }

    return this.prisma.organization.update({
      where: { id },
      data: dto,
      include: { subscriptions: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.organization.delete({ where: { id } });
    return { message: 'تم حذف المؤسسة بنجاح' };
  }
}
