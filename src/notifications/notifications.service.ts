
// src/notifications/notifications.service.ts
// خدمة إدارة الإشعارات مع Firebase Push Notifications

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from './firebase.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  // إنشاء وإرسال إشعار
  async create(dto: CreateNotificationDto) {
    // حفظ الإشعار في قاعدة البيانات
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        relatedId: dto.relatedId,
        relatedType: dto.relatedType,
        title: dto.title,
        message: dto.message,
        type: dto.type || 'info',
        channel: dto.channel || 'in_app',
      },
    });

    // إرسال إشعار Firebase إذا كانت القناة push
    if (dto.channel === 'push') {
      try {
        // يمكن تخزين رمز FCM في جدول منفصل أو في جدول المستخدمين
        // هنا نرسل إلى موضوع المستخدم
        await this.firebaseService.sendToTopic(
          `user_${dto.userId}`,
          dto.title,
          dto.message,
          {
            notificationId: notification.id.toString(),
            relatedType: dto.relatedType || 'general',
            relatedId: dto.relatedId?.toString() || '',
          },
        );

        // تحديث حالة الإرسال
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { sent: true, sentAt: new Date() },
        });
      } catch (error) {
        console.error('فشل إرسال إشعار Firebase:', error);
      }
    }

    return notification;
  }

  // جلب إشعارات مستخدم
  async findByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  // جلب عدد الإشعارات غير المقروءة
  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  // تحديد إشعار كمقروء
  async markAsRead(id: number) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('الإشعار غير موجود');

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  // تحديد جميع الإشعارات كمقروءة
  async markAllAsRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
  }

  // حذف إشعار
  async remove(id: number) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('الإشعار غير موجود');

    await this.prisma.notification.delete({ where: { id } });
    return { message: 'تم حذف الإشعار بنجاح' };
  }

  // إرسال إشعار جماعي (لكل المستخدمين من دور معين)
  async sendBulkNotification(
    role: string,
    title: string,
    message: string,
    relatedType?: any,
  ) {
    const users = await this.prisma.user.findMany({
      where: { role: role as any, isActive: true },
      select: { id: true },
    });

    const notifications = await Promise.all(
      users.map((user) =>
        this.create({
          userId: user.id,
          title,
          message,
          type: 'info',
          channel: 'push',
          relatedType,
        }),
      ),
    );

    return {
      message: `تم إرسال ${notifications.length} إشعار بنجاح`,
      count: notifications.length,
    };
  }
}