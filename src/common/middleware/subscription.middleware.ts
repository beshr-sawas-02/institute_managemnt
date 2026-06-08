import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class SubscriptionMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    let payload: any;

    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch {
      return next();
    }

    if (!payload || payload.source !== 'org' || !payload.orgId) {
      return next();
    }

    const org = await prisma.organization.findUnique({
      where: { id: payload.orgId },
      select: { isActive: true },
    });

    if (!org || !org.isActive) {
      throw new ForbiddenException('المؤسسة غير مفعلة');
    }

    const activeSub = await prisma.subscription.findFirst({
      where: { organizationId: payload.orgId, status: 'active' },
      select: { id: true },
    });

    const totalSubs = await prisma.subscription.count({
      where: { organizationId: payload.orgId },
    });

    if (totalSubs > 0 && !activeSub) {
      throw new ForbiddenException('انتهت صلاحية الاشتراك. تواصل مع الإدارة');
    }

    next();
  }
}
