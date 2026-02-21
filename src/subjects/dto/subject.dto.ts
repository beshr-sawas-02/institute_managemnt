// src/subjects/dto/subject.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({ example: 'الرياضيات' })
  @IsString()
  @IsNotEmpty({ message: 'اسم المادة مطلوب' })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}