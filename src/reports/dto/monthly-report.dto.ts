// src/reports/dto/monthly-report.dto.ts

import { IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GenerateMonthlyReportDto {
  @ApiProperty({ description: 'رقم الشهر (1-12)', example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'الشهر يجب أن يكون بين 1 و 12' })
  @Max(12, { message: 'الشهر يجب أن يكون بين 1 و 12' })
  month: number;

  @ApiProperty({ description: 'السنة', example: 2025 })
  @Type(() => Number)
  @IsInt()
  @Min(2020)
  year: number;
}

export class GenerateSectionMonthlyReportDto extends GenerateMonthlyReportDto {
  @ApiProperty({ description: 'معرف الشعبة', example: 1 })
  @Type(() => Number)
  @IsInt()
  sectionId: number;
}