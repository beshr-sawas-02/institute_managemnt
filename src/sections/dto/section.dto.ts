// src/sections/dto/section.dto.ts
import {
  IsString, IsNotEmpty, IsOptional, IsInt, IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { SectionStatus } from '@prisma/client';

export class CreateSectionDto {
  @ApiProperty()
  @IsInt()
  gradeId: number;

  @ApiProperty({ example: 'أ' })
  @IsString()
  @IsNotEmpty({ message: 'اسم الشعبة مطلوب' })
  name: string;

  @ApiProperty({ example: '2024-2025' })
  @IsString()
  @IsNotEmpty({ message: 'السنة الدراسية مطلوبة' })
  academicYear: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  maxStudents?: number;

  @ApiPropertyOptional({ enum: SectionStatus })
  @IsOptional()
  @IsEnum(SectionStatus)
  status?: SectionStatus;
}

export class UpdateSectionDto extends PartialType(CreateSectionDto) {}