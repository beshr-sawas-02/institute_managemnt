import {
  IsInt,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty({ example: '2025-09-14' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  lateMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkStudentAttendanceDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  lateMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkAttendanceDto {
  @ApiProperty()
  @IsInt()
  sectionId: number;

  @ApiProperty({ example: '2025-09-14' })
  @IsDateString()
  date: string;

  @ApiProperty({ type: [BulkStudentAttendanceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkStudentAttendanceDto)
  students: BulkStudentAttendanceDto[];
}

export class ExceptionStudentDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  lateMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SmartBulkAttendanceDto {
  @ApiProperty()
  @IsInt()
  sectionId: number;

  @ApiProperty({ example: '2025-09-14' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ type: [ExceptionStudentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExceptionStudentDto)
  exceptions?: ExceptionStudentDto[];
}

export class UpdateAttendanceDto {
  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  lateMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}