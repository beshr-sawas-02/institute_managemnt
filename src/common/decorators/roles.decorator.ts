import { SetMetadata } from '@nestjs/common';

export type AppRole =
  | 'admin'
  | 'reception'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'super_admin'
  | 'support';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

export const PLATFORM_ROLES_KEY = 'platform_roles';
export const PlatformRoles = (...roles: AppRole[]) =>
  SetMetadata(PLATFORM_ROLES_KEY, roles);
