import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateGradeSubjectDto {
  @ApiProperty()
  @IsInt()
  gradeId: number;

  @ApiProperty()
  @IsInt()
  subjectId: number;

  @ApiProperty({ description: 'معرف المعلم - إجباري' })
  @IsInt()
  teacherId: number;

  @ApiPropertyOptional({ description: 'معرف الشعبة (اختياري)' })
  @IsOptional()
  @IsInt()
  sectionId?: number;
}

export class UpdateGradeSubjectDto extends PartialType(CreateGradeSubjectDto) {}