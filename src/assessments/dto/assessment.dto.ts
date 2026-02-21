// src/assessments/dto/assessment.dto.ts
import {
  IsInt, IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AssessmentType } from '@prisma/client';

export class CreateAssessmentDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty()
  @IsInt()
  gradeSubjectId: number;

  @ApiProperty({ enum: AssessmentType })
  @IsEnum(AssessmentType, { message: 'نوع التقييم غير صالح' })
  type: AssessmentType;

  @ApiProperty({ example: 'اختبار الفصل الأول' })
  @IsString()
  @IsNotEmpty({ message: 'عنوان التقييم مطلوب' })
  title: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  maxScore: number;

  @ApiPropertyOptional({ example: 85 })
  @IsOptional()
  @IsNumber()
  score?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ example: '2024-10-15' })
  @IsDateString()
  assessmentDate: string;
}

export class UpdateAssessmentDto extends PartialType(CreateAssessmentDto) {}