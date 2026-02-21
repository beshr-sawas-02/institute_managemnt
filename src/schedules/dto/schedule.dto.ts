// src/schedules/dto/schedule.dto.ts
import {
  IsInt, IsNotEmpty, IsOptional, IsString, IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { DayOfWeek, ScheduleStatus } from '@prisma/client';

export class CreateScheduleDto {
  @ApiProperty()
  @IsInt()
  sectionId: number;

  @ApiProperty()
  @IsInt()
  gradeSubjectId: number;

  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek, { message: 'يوم الأسبوع غير صالح' })
  dayOfWeek: DayOfWeek;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty({ message: 'وقت البداية مطلوب' })
  startTime: string;

  @ApiProperty({ example: '08:45' })
  @IsString()
  @IsNotEmpty({ message: 'وقت النهاية مطلوب' })
  endTime: string;

  @ApiPropertyOptional({ example: 'قاعة 101' })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiPropertyOptional({ enum: ScheduleStatus })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;
}

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}