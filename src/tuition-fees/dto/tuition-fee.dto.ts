// src/tuition-fees/dto/tuition-fee.dto.ts

import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateTuitionFeeDto {
  @ApiProperty({ description: 'معرف الصف', example: 1 })
  @IsInt()
  gradeId: number;

  @ApiProperty({ description: 'السنة الدراسية', example: '2024-2025' })
  @IsString()
  @IsNotEmpty({ message: 'السنة الدراسية مطلوبة' })
  academicYear: string;

  @ApiProperty({ description: 'مبلغ القسط السنوي', example: 5000000 })
  @IsNumber()
  @Min(0, { message: 'المبلغ يجب أن يكون موجباً' })
  annualAmount: number;

  @ApiPropertyOptional({ description: 'ملاحظات' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTuitionFeeDto extends PartialType(CreateTuitionFeeDto) {}