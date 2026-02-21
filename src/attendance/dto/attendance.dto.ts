// src/attendance/dto/attendance.dto.ts
import {
  IsInt, IsNotEmpty, IsEnum, IsOptional, IsString, IsDateString, IsArray, ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty()
  @IsInt()
  scheduleId: number;

  @ApiProperty({ example: '2024-09-15' })
  @IsDateString()
  @IsNotEmpty({ message: 'التاريخ مطلوب' })
  date: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus, { message: 'حالة الحضور غير صالحة' })
  status: AttendanceStatus;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  lateMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

// تسجيل حضور مجموعة طلاب دفعة واحدة
export class BulkAttendanceItemDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  lateMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkAttendanceDto {
  @ApiProperty()
  @IsInt()
  scheduleId: number;

  @ApiProperty({ example: '2024-09-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [BulkAttendanceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkAttendanceItemDto)
  students: BulkAttendanceItemDto[];
}

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}

export class AttendanceFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  studentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  scheduleId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}