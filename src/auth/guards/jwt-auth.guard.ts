// src/auth/guards/jwt-auth.guard.ts
// حارس التوثيق JWT

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('يجب تسجيل الدخول أولاً');
    }
    return user;
  }
}