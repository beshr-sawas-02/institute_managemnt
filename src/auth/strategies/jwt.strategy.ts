import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  orgId: number | null;
  source: 'platform' | 'org';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.source === 'platform') {
      const platformUser = await this.prisma.platformUser.findUnique({
        where: { id: payload.sub },
      });

      if (!platformUser || !platformUser.isActive) {
        throw new UnauthorizedException('مستخدم المنصة غير موجود أو غير مفعل');
      }

      return {
        id: platformUser.id,
        email: platformUser.email,
        role: platformUser.role,
        orgId: null,
        source: 'platform' as const,
      };
    }

    // source === 'org'
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { organization: { select: { id: true, isActive: true } } },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('المستخدم غير موجود أو غير مفعل');
    }

    if (!user.organization || !user.organization.isActive) {
      throw new UnauthorizedException('المؤسسة غير مفعلة');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      orgId: user.organizationId,
      source: 'org' as const,
    };
  }
}
