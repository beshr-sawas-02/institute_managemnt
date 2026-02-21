// src/parents/dto/parent.dto.ts
// كائنات نقل بيانات أولياء الأمور

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Relationship } from '@prisma/client';

export class CreateParentDto {
  @ApiPropertyOptional({ description: 'معرف المستخدم المرتبط' })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({ description: 'الاسم الأول', example: 'أحمد' })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  firstName: string;

  @ApiProperty({ description: 'اسم العائلة', example: 'محمد' })
  @IsString()
  @IsNotEmpty({ message: 'اسم العائلة مطلوب' })
  lastName: string;

  @ApiProperty({ description: 'رقم الهاتف', example: '+966501234567' })
  @IsString()
  @IsNotEmpty({ message: 'رقم الهاتف مطلوب' })
  phone: string;

  @ApiPropertyOptional({ description: 'البريد الإلكتروني' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'العنوان' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'صلة القرابة', enum: Relationship })
  @IsEnum(Relationship, { message: 'صلة القرابة غير صالحة' })
  relationship: Relationship;
}

export class UpdateParentDto extends PartialType(CreateParentDto) {}