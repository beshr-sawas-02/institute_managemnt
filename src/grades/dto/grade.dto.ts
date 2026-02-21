// src/grades/dto/grade.dto.ts
// كائنات نقل بيانات الصفوف

import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { GradeLevel } from '@prisma/client';

export class CreateGradeDto {
  @ApiProperty({ example: 'الصف الأول' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الصف مطلوب' })
  name: string;

  @ApiProperty({ enum: GradeLevel, description: 'المرحلة الدراسية' })
  @IsEnum(GradeLevel, { message: 'المرحلة غير صالحة' })
  level: GradeLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateGradeDto extends PartialType(CreateGradeDto) {}