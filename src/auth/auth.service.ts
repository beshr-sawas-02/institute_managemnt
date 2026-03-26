// src/auth/auth.service.ts

import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UpdatePreferredLanguageDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password, preferredLanguage } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException('الحساب معطل. تواصل مع الإدارة');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        ...(preferredLanguage ? { preferredLanguage } : {}),
      },
    });

    const token = this.generateToken(updatedUser.id, updatedUser.email, updatedUser.role);

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        preferredLanguage: updatedUser.preferredLanguage,
      },
      accessToken: token,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, phone, role, preferredLanguage } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        role,
        preferredLanguage: preferredLanguage ?? 'ar',
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
      },
      accessToken: token,
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('كلمة المرور الحالية غير صحيحة');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'تم تغيير كلمة المرور بنجاح' };
  }

  async updatePreferredLanguage(
    userId: number,
    dto: UpdatePreferredLanguageDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { preferredLanguage: dto.preferredLanguage },
      select: {
        id: true,
        preferredLanguage: true,
        updatedAt: true,
      },
    });

    return {
      message: 'تم تحديث لغة التطبيق بنجاح',
      user: updatedUser,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      throw new BadRequestException('المستخدم غير موجود');
    }

    let firstName: string | null = null;
    let lastName: string | null = null;

    if (user.role === 'reception' && user.reception) {
      firstName = user.reception.firstName;
      lastName = user.reception.lastName;
    } else if (user.role === 'teacher' && user.teacher) {
      firstName = user.teacher.firstName;
      lastName = user.teacher.lastName;
    } else if (user.role === 'parent' && user.parent) {
      firstName = user.parent.firstName;
      lastName = user.parent.lastName;
    } else if (user.role === 'student' && user.student) {
      firstName = user.student.firstName;
      lastName = user.student.lastName;
    }

    return {
      ...user,
      firstName,
      lastName,
    };
  }

  private generateToken(userId: number, email: string, role: string): string {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign(payload);
  }
}
