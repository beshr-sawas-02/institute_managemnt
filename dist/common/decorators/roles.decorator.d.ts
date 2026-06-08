export type AppRole = 'admin' | 'reception' | 'teacher' | 'student' | 'parent' | 'super_admin' | 'support';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const PLATFORM_ROLES_KEY = "platform_roles";
export declare const PlatformRoles: (...roles: AppRole[]) => import("@nestjs/common").CustomDecorator<string>;
