// src/notifications/notifications.service.ts

import {
  AppLanguage,
  NotificationChannel,
  NotificationRelatedType,
  NotificationType,
} from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from './firebase.service';
import {
  BulkNotificationDto,
  CreateNotificationDto,
} from './dto/notification.dto';
import {
  LocalizedBalance,
  LocalizedNotificationContent,
  LocalizedText,
  buildAbsenceNotification,
  buildAssessmentResultNotification,
  buildLateNotification,
  buildNewPaymentNotification,
  buildOverduePaymentNotification,
  buildPaymentConfirmedNotification,
  buildStudentRegisteredNotification,
} from './notification-localization';

type StudentBalance = LocalizedBalance;

type CreateNotificationInput = CreateNotificationDto & {
  preferredLanguage?: AppLanguage;
};

type CreateLocalizedNotificationInput = {
  userId: number;
  preferredLanguage?: AppLanguage;
  relatedId?: number;
  relatedType?: NotificationRelatedType;
  type?: NotificationType;
  channel?: NotificationChannel;
  data?: Record<string, any>;
  content: LocalizedNotificationContent;
};

type StoredLocalizedContent = {
  title: LocalizedText;
  message: LocalizedText;
};

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
  ) {}

  async create(dto: CreateNotificationInput) {
    const preferredLanguage =
      dto.preferredLanguage ?? (await this.getUserPreferredLanguage(dto.userId));
    const localizedContent = this.buildLocalizedContent(dto);

    if (!localizedContent) {
      throw new BadRequestException('عنوان الإشعار ومحتواه مطلوبان');
    }

    const title = this.resolveLocalizedText(localizedContent.title, preferredLanguage);
    const message = this.resolveLocalizedText(
      localizedContent.message,
      preferredLanguage,
    );
    const channel = dto.channel ?? 'in_app';

    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        relatedId: dto.relatedId,
        relatedType: dto.relatedType,
        title,
        message,
        type: dto.type ?? 'info',
        channel,
        data: this.attachLocalizedContent(dto.data, localizedContent),
      },
    });

    if (channel === 'push') {
      try {
        await this.firebaseService.sendToTopic(
          `user_${dto.userId}`,
          title,
          message,
          {
            notificationId: notification.id.toString(),
            relatedType: dto.relatedType ?? 'general',
            relatedId: dto.relatedId?.toString() ?? '',
          },
        );

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { sent: true, sentAt: new Date() },
        });
      } catch (error) {
        console.error('Failed to send Firebase notification:', error);
      }
    }

    return this.localizeNotification(notification, preferredLanguage);
  }

  async createLocalizedNotification(dto: CreateLocalizedNotificationInput) {
    return this.create({
      userId: dto.userId,
      preferredLanguage: dto.preferredLanguage,
      relatedId: dto.relatedId,
      relatedType: dto.relatedType,
      type: dto.type,
      channel: dto.channel,
      data: dto.data,
      titleAr: dto.content.title.ar,
      titleEn: dto.content.title.en,
      messageAr: dto.content.message.ar,
      messageEn: dto.content.message.en,
    });
  }

  async notifyAbsence(studentId: number, attendanceId: number) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { parent: { include: { user: true } } },
      });

      if (!student?.parent?.user) return;

      const content = buildAbsenceNotification(
        `${student.firstName} ${student.lastName}`,
      );

      await this.createLocalizedNotification({
        userId: student.parent.user.id,
        preferredLanguage: student.parent.user.preferredLanguage,
        relatedId: attendanceId,
        relatedType: 'attendance',
        type: 'warning',
        channel: 'push',
        content,
      });
    } catch (error) {
      console.error('Attendance absence notification failed:', error);
    }
  }

  async notifyLate(
    studentId: number,
    lateMinutes: number,
    attendanceId: number,
  ) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { parent: { include: { user: true } } },
      });

      if (!student?.parent?.user) return;

      const content = buildLateNotification(
        `${student.firstName} ${student.lastName}`,
        lateMinutes,
      );

      await this.createLocalizedNotification({
        userId: student.parent.user.id,
        preferredLanguage: student.parent.user.preferredLanguage,
        relatedId: attendanceId,
        relatedType: 'attendance',
        type: 'warning',
        channel: 'push',
        content,
      });
    } catch (error) {
      console.error('Attendance late notification failed:', error);
    }
  }

  async notifyNewAssessment(
    studentId: number,
    assessmentTitle: string,
    score: number,
    maxScore: number,
    subjectName: string,
    assessmentId: number,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });

    if (!student?.parent?.user) return;

    const percentage = (score / maxScore) * 100;
    const notifType = percentage >= 50 ? 'success' : 'warning';
    const content = buildAssessmentResultNotification({
      studentName: `${student.firstName} ${student.lastName}`,
      subjectName,
      assessmentType: 'exam',
      assessmentTitle,
      maxScore,
      score,
      percentage,
      grade: null,
    });

    return this.createLocalizedNotification({
      userId: student.parent.user.id,
      preferredLanguage: student.parent.user.preferredLanguage,
      relatedId: assessmentId,
      relatedType: 'assessment',
      type: notifType as NotificationType,
      channel: 'push',
      content,
    });
  }

  async notifyNewPaymentWithBalance(
    studentId: number,
    amount: number,
    dueDate: string,
    paymentId: number,
    balance: StudentBalance,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });

    if (!student?.parent?.user) return;

    const content = buildNewPaymentNotification(
      `${student.firstName} ${student.lastName}`,
      amount,
      dueDate,
      balance,
    );

    return this.createLocalizedNotification({
      userId: student.parent.user.id,
      preferredLanguage: student.parent.user.preferredLanguage,
      relatedId: paymentId,
      relatedType: 'payment',
      type: 'info',
      channel: 'push',
      content,
    });
  }

  async notifyPaymentConfirmedWithBalance(
    studentId: number,
    amount: number,
    receiptNumber: string,
    paymentId: number,
    balance: StudentBalance,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });

    if (!student?.parent?.user) return;

    const content = buildPaymentConfirmedNotification(
      `${student.firstName} ${student.lastName}`,
      amount,
      receiptNumber,
      balance,
    );

    return this.createLocalizedNotification({
      userId: student.parent.user.id,
      preferredLanguage: student.parent.user.preferredLanguage,
      relatedId: paymentId,
      relatedType: 'payment',
      type: 'success',
      channel: 'push',
      content,
    });
  }

  async notifyOverduePayment(
    studentId: number,
    amount: number,
    dueDate: string,
    paymentId: number,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });

    if (!student?.parent?.user) return;

    const content = buildOverduePaymentNotification(
      `${student.firstName} ${student.lastName}`,
      amount,
      dueDate,
    );

    return this.createLocalizedNotification({
      userId: student.parent.user.id,
      preferredLanguage: student.parent.user.preferredLanguage,
      relatedId: paymentId,
      relatedType: 'payment',
      type: 'alert',
      channel: 'push',
      content,
    });
  }

  async notifyStudentRegistered(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        parent: { include: { user: true } },
        section: { include: { grade: true } },
      },
    });

    if (!student?.parent?.user) return;

    const sectionInfo = student.section
      ? `${student.section.grade?.name} - ${student.section.name}`
      : 'غير محدد';
    const sectionInfoEn = student.section
      ? `${student.section.grade?.name} - ${student.section.name}`
      : 'Section not assigned yet';

    const content = buildStudentRegisteredNotification(
      `${student.firstName} ${student.lastName}`,
      sectionInfo,
      sectionInfoEn,
    );

    return this.createLocalizedNotification({
      userId: student.parent.user.id,
      preferredLanguage: student.parent.user.preferredLanguage,
      relatedId: student.id,
      relatedType: 'general',
      type: 'success',
      channel: 'push',
      content,
    });
  }

  async findByUser(userId: number) {
    const [preferredLanguage, notifications] = await Promise.all([
      this.getUserPreferredLanguage(userId),
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return notifications.map((notification) =>
      this.localizeNotification(notification, preferredLanguage),
    );
  }

  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  async markAsRead(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('الإشعار غير موجود');
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });

    const preferredLanguage = await this.getUserPreferredLanguage(updated.userId);
    return this.localizeNotification(updated, preferredLanguage);
  }

  async markAllAsRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
  }

  async remove(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('الإشعار غير موجود');
    }

    await this.prisma.notification.delete({ where: { id } });
    return { message: 'تم حذف الإشعار بنجاح' };
  }

  async sendBulkNotification(dto: BulkNotificationDto) {
    const users = await this.prisma.user.findMany({
      where: { role: dto.role, isActive: true },
      select: { id: true, preferredLanguage: true },
    });

    const notifications = await Promise.all(
      users.map((user) =>
        this.create({
          userId: user.id,
          preferredLanguage: user.preferredLanguage,
          title: dto.title,
          titleAr: dto.titleAr,
          titleEn: dto.titleEn,
          message: dto.message,
          messageAr: dto.messageAr,
          messageEn: dto.messageEn,
          type: 'info',
          channel: 'push',
          relatedType: dto.relatedType,
        }),
      ),
    );

    return {
      message: `تم إرسال ${notifications.length} إشعار بنجاح`,
      count: notifications.length,
    };
  }

  private async getUserPreferredLanguage(userId: number): Promise<AppLanguage> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferredLanguage: true },
    });

    return user?.preferredLanguage ?? 'ar';
  }

  private buildLocalizedContent(
    dto: CreateNotificationInput,
  ): StoredLocalizedContent | null {
    const title = this.normalizeLocalizedText(dto.title, dto.titleAr, dto.titleEn);
    const message = this.normalizeLocalizedText(
      dto.message,
      dto.messageAr,
      dto.messageEn,
    );

    if (!title || !message) {
      return null;
    }

    return { title, message };
  }

  private normalizeLocalizedText(
    fallback?: string,
    arabic?: string,
    english?: string,
  ): LocalizedText | null {
    const defaultValue = fallback?.trim();
    const ar = arabic?.trim() || defaultValue || english?.trim();
    const en = english?.trim() || defaultValue || arabic?.trim();

    if (!ar || !en) {
      return null;
    }

    return { ar, en };
  }

  private resolveLocalizedText(
    text: LocalizedText,
    language: AppLanguage,
  ): string {
    return language === 'en' ? text.en : text.ar;
  }

  private attachLocalizedContent(
    data: Record<string, any> | undefined,
    localizedContent: StoredLocalizedContent,
  ) {
    return {
      ...(data ?? {}),
      localizedContent,
    };
  }

  private extractLocalizedContent(data: unknown): StoredLocalizedContent | null {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return null;
    }

    const localizedContent = (data as Record<string, any>).localizedContent;
    if (!localizedContent || typeof localizedContent !== 'object') {
      return null;
    }

    if (
      !localizedContent.title ||
      !localizedContent.message ||
      typeof localizedContent.title.ar !== 'string' ||
      typeof localizedContent.title.en !== 'string' ||
      typeof localizedContent.message.ar !== 'string' ||
      typeof localizedContent.message.en !== 'string'
    ) {
      return null;
    }

    return localizedContent as StoredLocalizedContent;
  }

  private localizeNotification<T extends { title: string; message: string; data: any }>(
    notification: T,
    preferredLanguage: AppLanguage,
  ): T {
    const localizedContent = this.extractLocalizedContent(notification.data);

    if (!localizedContent) {
      return notification;
    }

    return {
      ...notification,
      title: this.resolveLocalizedText(localizedContent.title, preferredLanguage),
      message: this.resolveLocalizedText(
        localizedContent.message,
        preferredLanguage,
      ),
    };
  }
}
