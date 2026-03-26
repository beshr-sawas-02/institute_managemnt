import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationChannel,
  NotificationRelatedType,
  NotificationType,
  UserRole,
} from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  relatedId?: number;

  @ApiPropertyOptional({ enum: NotificationRelatedType })
  @IsOptional()
  @IsEnum(NotificationRelatedType)
  relatedType?: NotificationRelatedType;

  @ApiPropertyOptional({ example: 'تنبيه جديد' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'New alert' })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiPropertyOptional({ example: 'تنبيه جديد' })
  @IsOptional()
  @IsString()
  titleAr?: string;

  @ApiPropertyOptional({ example: 'محتوى الإشعار' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'Notification body' })
  @IsOptional()
  @IsString()
  messageEn?: string;

  @ApiPropertyOptional({ example: 'محتوى الإشعار' })
  @IsOptional()
  @IsString()
  messageAr?: string;

  @ApiPropertyOptional({ enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ enum: NotificationChannel })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class BulkNotificationDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ example: 'تنبيه عام' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'General alert' })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiPropertyOptional({ example: 'تنبيه عام' })
  @IsOptional()
  @IsString()
  titleAr?: string;

  @ApiPropertyOptional({ example: 'هذه رسالة عامة' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'This is a general message' })
  @IsOptional()
  @IsString()
  messageEn?: string;

  @ApiPropertyOptional({ example: 'هذه رسالة عامة' })
  @IsOptional()
  @IsString()
  messageAr?: string;

  @ApiPropertyOptional({ enum: NotificationRelatedType })
  @IsOptional()
  @IsEnum(NotificationRelatedType)
  relatedType?: NotificationRelatedType;
}
