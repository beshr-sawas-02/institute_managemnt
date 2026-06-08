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
  @ApiProperty({ example: 'admin@school.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
  password: string;

  @ApiProperty({ description: 'Organization slug', example: 'default-org' })
  @IsString()
  @IsNotEmpty({ message: 'معرف المؤسسة مطلوب' })
  slug: string;

  @ApiPropertyOptional({ enum: AppLanguage })
  @IsOptional()
  @IsEnum(AppLanguage)
  preferredLanguage?: AppLanguage;
}

export class PlatformLoginDto {
  @ApiProperty({ example: 'superadmin@platform.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@school.com' })
  @IsEmail({}, { message: 'البريد الإلكتروني غير صالح' })
  @IsNotEmpty({ message: 'البريد الإلكتروني مطلوب' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
  @MinLength(6)
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: AppLanguage })
  @IsOptional()
  @IsEnum(AppLanguage)
  preferredLanguage?: AppLanguage;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole, { message: 'الدور غير صالح' })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ description: 'Organization slug' })
  @IsString()
  @IsNotEmpty({ message: 'معرف المؤسسة مطلوب' })
  slug: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور الحالية مطلوبة' })
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'كلمة المرور الجديدة مطلوبة' })
  @MinLength(6)
  newPassword: string;
}

export class UpdatePreferredLanguageDto {
  @ApiProperty({ enum: AppLanguage })
  @IsEnum(AppLanguage)
  preferredLanguage: AppLanguage;
}

export class UpdateFcmTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'رمز FCM مطلوب' })
  fcmToken: string;
}
