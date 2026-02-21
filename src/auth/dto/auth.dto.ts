// src/auth/dto/auth.dto.ts
// كائنات نقل بيانات التوثيق

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

// ============ تسجيل الدخول ============
export class LoginDto {
  @ApiProperty({ description: 'البريد الإلكتروني', example: 'admin@school.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ description: 'كلمة المرور', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password: string;
}

// ============ التسجيل ============
export class RegisterDto {
  @ApiProperty({ description: 'البريد الإلكتروني', example: 'user@school.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ description: 'كلمة المرور', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password: string;

  @ApiPropertyOptional({ description: 'رقم الهاتف', example: '+966501234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'دور المستخدم',
    enum: UserRole,
    example: 'student',
  })
  @IsEnum(UserRole, { message: 'الدور غير صالح' })
  @IsNotEmpty({ message: 'الدور مطلوب' })
  role: UserRole;
}

// ============ تغيير كلمة المرور ============
export class ChangePasswordDto {
  @ApiProperty({ description: 'كلمة المرور الحالية' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور الحالية مطلوبة' })
  currentPassword: string;

  @ApiProperty({ description: 'كلمة المرور الجديدة' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  newPassword: string;
}

// ============ تحديث رمز FCM ============
export class UpdateFcmTokenDto {
  @ApiProperty({ description: 'رمز FCM للإشعارات' })
  @IsString()
  @IsNotEmpty({ message: 'رمز FCM مطلوب' })
  fcmToken: string;
}