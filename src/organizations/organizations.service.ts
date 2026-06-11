import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const [existingOrganization, existingUser] = await Promise.all([
      this.prisma.organization.findUnique({ where: { slug: dto.slug } }),
      this.prisma.user.findUnique({ where: { email: dto.email } }),
    ]);

    if (existingOrganization) {
      throw new ConflictException('هذا المعرف مستخدم بالفعل');
    }

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const { adminPassword, nameAr, nameEn, ...organizationData } = dto;
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const organization = await this.prisma.$transaction(async (tx) => {
      const createdOrganization = await tx.organization.create({
        data: {
          ...organizationData,
          name: nameAr,
          nameAr,
          nameEn,
          typeAr: organizationData.type === 'school' ? 'مدرسة' : 'معهد',
          typeEn: organizationData.type === 'school' ? 'School' : 'Institute',
          isActive: false,
        },
        include: { subscriptions: true },
      });

      await tx.user.create({
        data: {
          organizationId: createdOrganization.id,
          email: createdOrganization.email,
          password: hashedPassword,
          phone: createdOrganization.phone,
          role: 'admin',
          isActive: true,
        },
      });

      return createdOrganization;
    });

    return {
      organization,
      credentials: {
        email: organization.email,
        password: adminPassword,
      },
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameAr: { contains: search } },
        { nameEn: { contains: search } },
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

    return this.prisma.$transaction(async (tx) => {
      if (dto.isActive === true) {
        const activeSubscription = await tx.subscription.findFirst({
          where: { organizationId: id, status: 'active' },
          select: { id: true },
        });
        if (!activeSubscription) {
          throw new BadRequestException(
            'لا يمكن تنشيط المؤسسة قبل إضافة اشتراك نشط لها',
          );
        }
      }

      const { isActive, nameAr, type, ...rest } = dto;
      const organization = await tx.organization.update({
        where: { id },
        data: {
          ...rest,
          ...(nameAr !== undefined ? { nameAr, name: nameAr } : {}),
          ...(type !== undefined
            ? {
                type,
                typeAr: type === 'school' ? 'مدرسة' : 'معهد',
                typeEn: type === 'school' ? 'School' : 'Institute',
              }
            : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
        include: { subscriptions: true },
      });

      if (dto.isActive !== undefined) {
        await tx.subscription.updateMany({
          where: {
            organizationId: id,
            status: dto.isActive ? 'paused' : 'active',
          },
          data: { status: dto.isActive ? 'active' : 'paused' },
        });

        return tx.organization.findUnique({
          where: { id },
          include: { subscriptions: true },
        });
      }

      return organization;
    });
  }

  async updateLogo(id: number, logo: string) {
    const organization = await this.findOne(id);
    const updatedOrganization = await this.prisma.organization.update({
      where: { id },
      data: { logo },
      include: { subscriptions: true },
    });

    if (organization.logo?.startsWith(`/uploads/organizations/${id}/`)) {
      const oldLogoPath = join(
        process.cwd(),
        organization.logo.replace(/^\/+/, ''),
      );
      await unlink(oldLogoPath).catch(() => undefined);
    }

    return updatedOrganization;
  }

  async resetAdminPassword(id: number, newPassword: string) {
    const organization = await this.findOne(id);
    const admin =
      (await this.prisma.user.findFirst({
        where: {
          organizationId: id,
          role: 'admin',
          email: organization.email,
        },
      })) ??
      (await this.prisma.user.findFirst({
        where: { organizationId: id, role: 'admin' },
        orderBy: { id: 'asc' },
      }));

    if (!admin) {
      throw new NotFoundException('لا يوجد حساب مدير لهذه المؤسسة');
    }

    await this.prisma.user.update({
      where: { id: admin.id },
      data: {
        password: await bcrypt.hash(newPassword, 12),
        isActive: true,
      },
    });

    return {
      message: 'تم تغيير كلمة مرور مدير المؤسسة بنجاح',
      email: admin.email,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.organization.delete({ where: { id } });
    return { message: 'تم حذف المؤسسة بنجاح' };
  }
}
