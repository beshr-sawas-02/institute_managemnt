// src/teachers/dto/teacher.dto.ts
// كائنات نقل بيانات المعلمين

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { TeacherStatus } from '@prisma/client';

export class CreateTeacherDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({ example: 'محمد' })
  @IsString()
  @IsNotEmpty({ message: 'الاسم الأول مطلوب' })
  firstName: string;

  @ApiProperty({ example: 'علي' })
  @IsString()
  @IsNotEmpty({ message: 'اسم العائلة مطلوب' })
  lastName: string;

  @ApiProperty({ example: 'رياضيات' })
  @IsString()
  @IsNotEmpty({ message: 'التخصص مطلوب' })
  specialization: string;

  @ApiPropertyOptional({ example: 'بكالوريوس تربية' })
  @IsOptional()
  @IsString()
  qualifications?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  experienceYears?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 5000.00 })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiPropertyOptional({ enum: TeacherStatus })
  @IsOptional()
  @IsEnum(TeacherStatus)
  status?: TeacherStatus;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  hireDate?: string;
}

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}