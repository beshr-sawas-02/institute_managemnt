// src/common/decorators/roles.decorator.ts
// مُزخرف الأدوار - لتحديد الأدوار المسموح لها بالوصول

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);