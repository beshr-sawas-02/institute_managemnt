import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PLATFORM_ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPlatformRoles = this.reflector.getAllAndOverride<string[]>(
      PLATFORM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length && !requiredPlatformRoles?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('غير مصرح بالوصول');
    }

    // Platform-only routes — must be source: platform
    if (requiredPlatformRoles?.length) {
      if (user.source !== 'platform') {
        throw new ForbiddenException(
          'ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد',
        );
      }
      if (!requiredPlatformRoles.includes(user.role)) {
        throw new ForbiddenException(
          'ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد',
        );
      }
      return true;
    }

    // Org routes — must be source: org
    if (requiredRoles?.length) {
      if (user.source !== 'org') {
        throw new ForbiddenException(
          'ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد',
        );
      }
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(
          'ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد',
        );
      }
      return true;
    }

    return true;
  }
}
