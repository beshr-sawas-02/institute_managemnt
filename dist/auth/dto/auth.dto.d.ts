import { AppLanguage, UserRole } from '@prisma/client';
export declare class LoginDto {
    email: string;
    password: string;
    preferredLanguage?: AppLanguage;
}
export declare class RegisterDto {
    email: string;
    password: string;
    phone?: string;
    preferredLanguage?: AppLanguage;
    role: UserRole;
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
