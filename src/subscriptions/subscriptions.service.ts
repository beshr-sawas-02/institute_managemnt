import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  ExtendSubscriptionDto,
  UpdateSubscriptionStatusDto,
} from './dto/subscription.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto) {
    const startDate = this.parseDate(dto.startDate);
    const endDate = this.parseDate(dto.endDate);
    this.validateNewDates(startDate, endDate);

    return this.prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.create({
        data: {
          ...dto,
          startDate,
          endDate,
          status: 'active',
        },
        include: { organization: true },
      });
      await tx.organization.update({
        where: { id: dto.organizationId },
        data: { isActive: true },
      });
      return subscription;
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;
    const where: Prisma.SubscriptionWhereInput = search
      ? {
          OR: [
            { plan: { contains: search, mode: 'insensitive' } },
            { organization: { name: { contains: search, mode: 'insensitive' } } },
            { organization: { nameAr: { contains: search, mode: 'insensitive' } } },
            { organization: { nameEn: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

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
    if (!subscription) {
      throw new NotFoundException('الاشتراك غير موجود');
    }
    return subscription;
  }

  async update(id: number, dto: UpdateSubscriptionDto) {
    const current = await this.findOne(id);
    const data: Prisma.SubscriptionUpdateInput = {
      ...(dto.plan !== undefined ? { plan: dto.plan } : {}),
      ...(dto.price !== undefined ? { price: dto.price } : {}),
    };

    if (dto.startDate || dto.endDate) {
      const startDate = dto.startDate
        ? this.parseDate(dto.startDate)
        : new Date(current.startDate);
      const endDate = dto.endDate
        ? this.parseDate(dto.endDate)
        : new Date(current.endDate);
      const startDateChanged =
        dto.startDate !== undefined &&
        startDate.getTime() !== new Date(current.startDate).getTime();
      if (startDateChanged) this.validateNewDates(startDate, endDate);
      if (endDate < startDate) {
        throw new BadRequestException(
          'تاريخ نهاية الاشتراك يجب أن يكون بعد تاريخ البداية',
        );
      }
      if (dto.startDate) data.startDate = startDate;
      if (dto.endDate) data.endDate = endDate;
    }

    return this.prisma.subscription.update({
      where: { id },
      data,
      include: { organization: true },
    });
  }

  async extend(id: number, dto: ExtendSubscriptionDto) {
    const current = await this.findOne(id);
    const endDate = this.parseDate(dto.endDate);
    const minimumDate = new Date(
      Math.max(this.today().getTime(), new Date(current.endDate).getTime()),
    );
    if (endDate < minimumDate) {
      throw new BadRequestException(
        'تاريخ نهاية الاشتراك لا يمكن أن يكون قديمًا',
      );
    }
    return this.setStatusAndSyncOrganization(id, 'active', { endDate });
  }

  async updateStatus(id: number, dto: UpdateSubscriptionStatusDto) {
    await this.findOne(id);
    return this.setStatusAndSyncOrganization(id, dto.status);
  }

  async pause(id: number) {
    await this.findOne(id);
    return this.setStatusAndSyncOrganization(id, 'paused');
  }

  async remove(id: number) {
    const subscription = await this.findOne(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.subscription.delete({ where: { id } });
      await this.syncOrganizationStatus(tx, subscription.organizationId);
    });
    return { message: 'تم حذف الاشتراك بنجاح' };
  }

  private parseDate(value: string): Date {
    return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  }

  private today(): Date {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }

  private validateNewDates(startDate: Date, endDate: Date): void {
    if (startDate < this.today()) {
      throw new BadRequestException(
        'تاريخ بداية الاشتراك لا يمكن أن يكون قبل اليوم',
      );
    }
    if (endDate < startDate) {
      throw new BadRequestException(
        'تاريخ نهاية الاشتراك يجب أن يكون بعد تاريخ البداية',
      );
    }
  }

  private async setStatusAndSyncOrganization(
    id: number,
    status: 'active' | 'paused',
    extraData: Prisma.SubscriptionUpdateInput = {},
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.subscription.update({
        where: { id },
        data: { ...extraData, status },
        include: { organization: true },
      });
      await this.syncOrganizationStatus(tx, updated.organizationId);
      return updated;
    });
  }

  private async syncOrganizationStatus(
    tx: Prisma.TransactionClient,
    organizationId: number,
  ) {
    const activeSubscription = await tx.subscription.findFirst({
      where: { organizationId, status: 'active' },
      select: { id: true },
    });
    await tx.organization.update({
      where: { id: organizationId },
      data: { isActive: Boolean(activeSubscription) },
    });
  }
}
