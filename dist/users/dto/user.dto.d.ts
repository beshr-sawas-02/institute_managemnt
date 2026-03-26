import { AppLanguage, UserRole } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    password: string;
    phone?: string;
    preferredLanguage?: AppLanguage;
    role: UserRole;
}
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    isActive?: boolean;
}
export {};
