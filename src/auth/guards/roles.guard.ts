import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, PLATFORM_ROLES_KEY } from '../../common/decorators';

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

    const allRequired = [
      ...(requiredRoles ?? []),
      ...(requiredPlatformRoles ?? []),
    ];

    if (allRequired.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('غير مصرح بالوصول');
    }

    if (!allRequired.includes(user.role)) {
      throw new ForbiddenException('ليس لديك صلاحية للوصول إلى هذا المورد');
    }

    return true;
  }
}
