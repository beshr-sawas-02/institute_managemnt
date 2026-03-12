import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceptionDto, UpdateReceptionDto } from './dto/reception.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ReceptionService {
  constructor(private prisma: PrismaService) {}

  async create(createReceptionDto: CreateReceptionDto) {
    return this.prisma.reception.create({
      data: createReceptionDto,
      include: { user: { select: { id: true, email: true, role: true } } },
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
            { phone: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

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

  async findOne(id: number) {
    const reception = await this.prisma.reception.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, role: true } } },
    });

    if (!reception) {
      throw new NotFoundException('Reception not found');
    }

    return reception;
  }

  async update(id: number, updateReceptionDto: UpdateReceptionDto) {
    await this.findOne(id);

    return this.prisma.reception.update({
      where: { id },
      data: updateReceptionDto,
      include: { user: { select: { id: true, email: true, role: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.reception.delete({ where: { id } });
    return { message: 'Reception deleted successfully' };
  }
}
