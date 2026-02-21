// src/notifications/dto/notification.dto.ts
import {
  IsInt, IsNotEmpty, IsOptional, IsString, IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationRelatedType, NotificationType, NotificationChannel,
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

  @ApiProperty({ example: 'تنبيه جديد' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'محتوى الإشعار' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ enum: NotificationType })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({ enum: NotificationChannel })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;
}