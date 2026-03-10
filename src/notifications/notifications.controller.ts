// src/notifications/notifications.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('الإشعارات')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  @Roles(UserRole.admin,UserRole.reception)
  @ApiOperation({ summary: 'إنشاء إشعار' })
  create(@Body() dto: CreateNotificationDto) {
    return this.service.create(dto);
  }

  @Post('bulk')
  @Roles(UserRole.admin,UserRole.reception)
  @ApiOperation({ summary: 'إرسال إشعار جماعي' })
  sendBulk(@Body() body: { role: string; title: string; message: string }) {
    return this.service.sendBulkNotification(body.role, body.title, body.message);
  }

  @Get('my')
  @ApiOperation({ summary: 'جلب إشعاراتي' })
  findMyNotifications(@CurrentUser('id') userId: number) {
    return this.service.findByUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'عدد الإشعارات غير المقروءة' })
  getUnreadCount(@CurrentUser('id') userId: number) {
    return this.service.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'تحديد إشعار كمقروء' })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.service.markAsRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'تحديد جميع الإشعارات كمقروءة' })
  markAllAsRead(@CurrentUser('id') userId: number) {
    return this.service.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف إشعار' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}