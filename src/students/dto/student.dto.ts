// src/students/dto/student.dto.ts
// كائنات نقل بيانات الطلاب

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Gender, StudentStatus } from '@prisma/client';

export class CreateStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sectionId?: number;

  @ApiProperty({ example: 'خالد' })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  firstName: string;

  @ApiProperty({ example: 'أحمد' })
  @IsString()
  @IsNotEmpty({ message: 'اسم العائلة مطلوب' })
  lastName: string;

  @ApiProperty({ example: '2010-05-15' })
  @IsDateString({}, { message: 'تاريخ الميلاد غير صالح' })
  @IsNotEmpty({ message: 'تاريخ الميلاد مطلوب' })
  dateOfBirth: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender, { message: 'الجنس غير صالح' })
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '2024-2025' })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({ enum: StudentStatus })
  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}