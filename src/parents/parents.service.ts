// src/parents/parents.service.ts
// خدمة إدارة أولياء الأمور

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto, UpdateParentDto } from './dto/parent.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  async create(createParentDto: CreateParentDto) {

     const existing = await this.prisma.user.findUnique({
      where: { email: createParentDto.email },
    });
    
    return this.prisma.parent.create({
      data: createParentDto,
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
          ],
        }
      : {};

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

  async findOne(id: number) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
        students: {
          include: {
            section: { include: { grade: true } },
          },
        },
      },
    });

    if (!parent) {
      throw new NotFoundException('ولي الأمر غير موجود');
    }

    return parent;
  }

  async update(id: number, updateParentDto: UpdateParentDto) {
    await this.findOne(id);
    return this.prisma.parent.update({
      where: { id },
      data: updateParentDto,
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.parent.delete({ where: { id } });
    return { message: 'تم حذف ولي الأمر بنجاح' };
  }
}