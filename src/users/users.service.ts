import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        preferredLanguage: createUserDto.preferredLanguage ?? 'ar',
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        preferredLanguage: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async createParentUser(createUserDto: CreateUserDto) {
    if (createUserDto.role !== UserRole.parent) {
      throw new BadRequestException('Role must be parent');
    }

    const parent = await this.prisma.parent.findFirst({
      where: { email: createUserDto.email },
      select: { id: true, userId: true },
    });

    if (!parent) {
      throw new NotFoundException('No parent found with this email');
    }

    if (parent.userId) {
      throw new ConflictException('This parent already has a user account');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...createUserDto,
          role: UserRole.parent,
          preferredLanguage: createUserDto.preferredLanguage ?? 'ar',
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          preferredLanguage: true,
          isActive: true,
          createdAt: true,
        },
      });

      await tx.parent.update({
        where: { id: parent.id },
        data: { userId: user.id },
      });

      return user;
    });
  }

  async createReceptionUser(createUserDto: CreateUserDto) {
    const reception = await this.prisma.reception.findFirst({
      where: { email: createUserDto.email },
      select: { id: true, userId: true },
    });

    if (!reception) {
      throw new NotFoundException('No reception found with this email');
    }

    if (reception.userId) {
      throw new ConflictException('This reception already has a user account');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...createUserDto,
          role: UserRole.reception,
          preferredLanguage: createUserDto.preferredLanguage ?? 'ar',
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          preferredLanguage: true,
          isActive: true,
          createdAt: true,
        },
      });

      await tx.reception.update({
        where: { id: reception.id },
        data: { userId: user.id },
      });

      return user;
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          preferredLanguage: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        preferredLanguage: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        student: true,
        teacher: true,
        parent: true,
        reception: true,
      },
    });

    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        preferredLanguage: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: 'تم حذف المستخدم بنجاح' };
  }
}
