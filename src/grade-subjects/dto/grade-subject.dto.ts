// src/grade-subjects/dto/grade-subject.dto.ts
import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateGradeSubjectDto {
  @ApiProperty()
  @IsInt()
  gradeId: number;

  @ApiProperty()
  @IsInt()
  subjectId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  teacherId?: number;
}

export class UpdateGradeSubjectDto extends PartialType(CreateGradeSubjectDto) {}