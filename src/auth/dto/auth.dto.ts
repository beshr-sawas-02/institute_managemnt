// src/auth/dto/auth.dto.ts
// DTOs for authentication flows

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppLanguage, UserRole } from '@prisma/client';

export class LoginDto {
  @ApiProperty({ description: 'Email address', example: 'admin@school.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password: string;

  @ApiPropertyOptional({
    enum: AppLanguage,
    description: 'Current app language to sync with notification delivery',
  })
  @IsOptional()
  @IsEnum(AppLanguage)
  preferredLanguage?: AppLanguage;
}

export class RegisterDto {
  @ApiProperty({ description: 'Email address', example: 'user@school.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+966501234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    enum: AppLanguage,
    description: 'Current app language to sync with notification delivery',
  })
  @IsOptional()
  @IsEnum(AppLanguage)
  preferredLanguage?: AppLanguage;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: 'student',
  })
  @IsEnum(UserRole, { message: 'الدور غير صالح' })
  @IsNotEmpty({ message: 'الدور مطلوب' })
  role: UserRole;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور الحالية مطلوبة' })
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  newPassword: string;
}

export class UpdatePreferredLanguageDto {
  @ApiProperty({
    enum: AppLanguage,
    description: 'Preferred language used for notifications and profile responses',
  })
  @IsEnum(AppLanguage)
  preferredLanguage: AppLanguage;
}

export class UpdateFcmTokenDto {
  @ApiProperty({ description: 'FCM token for push notifications' })
  @IsString()
  @IsNotEmpty({ message: 'رمز FCM مطلوب' })
  fcmToken: string;
}
