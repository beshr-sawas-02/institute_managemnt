// src/notifications/notifications.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { RolesGuard } from '../common/guards';
import {
  BulkNotificationDto,
  CreateNotificationDto,
} from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'Create a notification' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.service.createForOrganization(orgId, dto);
  }

  @Post('bulk')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'Send a bulk notification' })
  sendBulk(
    @CurrentUser('orgId') orgId: number,
    @Body() body: BulkNotificationDto,
  ) {
    return this.service.sendBulkNotification(orgId, body);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my notifications' })
  findMyNotifications(@CurrentUser('id') userId: number) {
    return this.service.findByUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  getUnreadCount(@CurrentUser('id') userId: number) {
    return this.service.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.markAsRead(userId, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser('id') userId: number) {
    return this.service.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  remove(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(userId, id);
  }
}
