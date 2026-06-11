import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  UpdatePreferredLanguageDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ─── Org Login ────────────────────────────────────────────────────────────

  async login(loginDto: LoginDto) {
    const { email, password, slug, preferredLanguage } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        organization: {
          include: {
            subscriptions: {
              where: { status: 'active' },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    const organization = user.organization;

    if (slug && organization.slug !== slug) {
      throw new UnauthorizedException(
        'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      );
    }

    if (!organization.isActive || organization.subscriptions.length === 0) {
      throw new UnauthorizedException(
        'المؤسسة غير مفعلة أو لا تملك اشتراكًا نشطًا',
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

    const tokens = await this.generateOrgTokens(
      updatedUser.id,
      updatedUser.email,
      updatedUser.role,
      organization.id,
    );

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        orgId: organization.id,
        slug: organization.slug,
        organization: {
          id: organization.id,
          name: organization.name,
          nameAr: organization.nameAr,
          nameEn: organization.nameEn,
          type: organization.type,
          typeAr: organization.typeAr,
          typeEn: organization.typeEn,
          slug: organization.slug,
          logo: organization.logo,
          isActive: organization.isActive,
          hasActiveSubscription: organization.subscriptions.length > 0,
        },
        preferredLanguage: updatedUser.preferredLanguage,
        source: 'org',
      },
      ...tokens,
    };
  }
  // ─── Register ─────────────────────────────────────────────────────────────

  async register(registerDto: RegisterDto) {
    const { email, password, phone, role, preferredLanguage, slug } =
      registerDto;

    const organization = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (!organization) {
      throw new BadRequestException('المؤسسة غير موجودة');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email, organizationId: organization.id },
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
        organizationId: organization.id,
        preferredLanguage: preferredLanguage ?? 'ar',
      },
    });

    const tokens = await this.generateOrgTokens(
      user.id,
      user.email,
      user.role,
      organization.id,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        orgId: organization.id,
        preferredLanguage: user.preferredLanguage,
        source: 'org',
      },
      ...tokens,
    };
  }
  // ─── Refresh Token ────────────────────────────────────────────────────────

  async refresh(dto: RefreshTokenDto) {
    let payload: any;

    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('رمز التحديث غير صالح أو منتهي الصلاحية');
    }

    if (payload.source === 'platform') {
      const platformUser = await this.prisma.platformUser.findUnique({
        where: { id: payload.sub },
      });

      if (!platformUser || !platformUser.isActive) {
        throw new UnauthorizedException('المستخدم غير موجود');
      }

      const tokens = await this.generatePlatformTokens(
        platformUser.id,
        platformUser.email,
        platformUser.role,
      );

      return tokens;
    }

    // org source
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('المستخدم غير موجود');
    }

    const tokens = await this.generateOrgTokens(
      user.id,
      user.email,
      user.role,
      user.organizationId,
    );

    return tokens;
  }

  // ─── Change Password ──────────────────────────────────────────────────────

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('المستخدم غير موجود');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
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

  // ─── Update Language ──────────────────────────────────────────────────────

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
      select: { id: true, preferredLanguage: true, updatedAt: true },
    });

    return { message: 'تم تحديث لغة التطبيق بنجاح', user: updatedUser };
  }

  // ─── Get Profile ──────────────────────────────────────────────────────────

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
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            nameEn: true,
            type: true,
            typeAr: true,
            typeEn: true,
            slug: true,
            logo: true,
            isActive: true,
            subscriptions: {
              where: { status: 'active' },
              select: { id: true, status: true, endDate: true },
              take: 1,
            },
          },
        },
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
      organization: user.organization
        ? {
            ...user.organization,
            hasActiveSubscription:
              user.organization.subscriptions.length > 0,
          }
        : null,
      firstName,
      lastName,
    };
  }

  // ─── Token Generators ─────────────────────────────────────────────────────

  async generateOrgTokens(
    userId: number,
    email: string,
    role: string,
    orgId: number,
  ) {
    const payload = { sub: userId, email, role, orgId, source: 'org' };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }

  async generatePlatformTokens(userId: number, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
      orgId: null,
      source: 'platform',
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }
}
