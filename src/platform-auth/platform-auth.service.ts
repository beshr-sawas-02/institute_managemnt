import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { PlatformLoginDto } from '../auth/dto/auth.dto';

@Injectable()
export class PlatformAuthService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async login(dto: PlatformLoginDto) {
    const { email, password } = dto;

    const platformUser = await this.prisma.platformUser.findUnique({
      where: { email },
    });

    if (!platformUser) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    if (!platformUser.isActive) {
      throw new UnauthorizedException('الحساب معطل');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      platformUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    await this.prisma.platformUser.update({
      where: { id: platformUser.id },
      data: { lastLogin: new Date() },
    });

    const tokens = await this.authService.generatePlatformTokens(
      platformUser.id,
      platformUser.email,
      platformUser.role,
    );

    return {
      user: {
        id: platformUser.id,
        email: platformUser.email,
        role: platformUser.role,
        source: 'platform',
      },
      ...tokens,
    };
  }
}
