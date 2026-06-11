import { AppLanguage, UserRole } from '@prisma/client';
export declare class LoginDto {
    email: string;
    password: string;
    slug?: string;
    preferredLanguage?: AppLanguage;
}
export declare class PlatformLoginDto {
    email: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    phone?: string;
    preferredLanguage?: AppLanguage;
    role: UserRole;
    slug: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UpdatePreferredLanguageDto {
    preferredLanguage: AppLanguage;
}
export declare class UpdateFcmTokenDto {
    fcmToken: string;
}
