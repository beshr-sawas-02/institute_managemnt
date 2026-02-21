// src/reports/dto/report.dto.ts
import {
  IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType, ReportFormat } from '@prisma/client';

export class CreateReportDto {
  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType, { message: 'نوع التقرير غير صالح' })
  type: ReportType;

  @ApiProperty({ example: 'تقرير الحضور الشهري' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({ enum: ReportFormat })
  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @ApiPropertyOptional({ example: '2024-09-01' })
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiPropertyOptional({ example: '2024-09-30' })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;
}