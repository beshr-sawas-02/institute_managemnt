import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  ExtendSubscriptionDto,
} from './dto/subscription.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        ...createSubscriptionDto,
        price: createSubscriptionDto.price,
        startDate: new Date(createSubscriptionDto.startDate),
        endDate: new Date(createSubscriptionDto.endDate),
        status: 'active',
      },
      include: { organization: true },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.organization = { name: { contains: search } };
    }

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        include: { organization: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: { organization: true },
    });
    if (!subscription) throw new NotFoundException('الاشتراك غير موجود');
    return subscription;
  }

  async update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    await this.findOne(id);
    const data: any = { ...updateSubscriptionDto };
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    return this.prisma.subscription.update({
      where: { id },
      data,
      include: { organization: true },
    });
  }

  async extend(id: number, dto: ExtendSubscriptionDto) {
    await this.findOne(id);
    return this.prisma.subscription.update({
      where: { id },
      data: {
        endDate: new Date(dto.endDate),
        status: 'active',
      },
      include: { organization: true },
    });
  }

  async pause(id: number) {
    await this.findOne(id);
    return this.prisma.subscription.update({
      where: { id },
      data: { status: 'paused' },
      include: { organization: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.subscription.delete({ where: { id } });
    return { message: 'تم حذف الاشتراك بنجاح' };
  }
}
