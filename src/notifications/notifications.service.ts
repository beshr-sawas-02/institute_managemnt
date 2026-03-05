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

  async create(dto: CreateNotificationDto) {
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

    if (dto.channel === 'push') {
      try {
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

  // ==================== إشعارات الحضور ====================
  async notifyAbsence(studentId: number, subjectName: string, attendanceId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });
    if (!student?.parent?.userId) return;

    return this.create({
      userId: student.parent.userId,
      relatedId: attendanceId,
      relatedType: 'attendance',
      title: `غياب - ${student.firstName} ${student.lastName}`,
      message: `ابنكم ${student.firstName} غائب اليوم في مادة ${subjectName}`,
      type: 'warning',
      channel: 'push',
    });
  }

  async notifyLate(studentId: number, subjectName: string, lateMinutes: number, attendanceId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });
    if (!student?.parent?.userId) return;

    return this.create({
      userId: student.parent.userId,
      relatedId: attendanceId,
      relatedType: 'attendance',
      title: `تأخير - ${student.firstName} ${student.lastName}`,
      message: `ابنكم ${student.firstName} متأخر ${lateMinutes} دقيقة في مادة ${subjectName}`,
      type: 'warning',
      channel: 'push',
    });
  }

  // ==================== إشعارات التقييمات ====================
  async notifyNewAssessment(studentId: number, assessmentTitle: string, score: number, maxScore: number, subjectName: string, assessmentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });
    if (!student?.parent?.userId) return;

    const percentage = (score / maxScore) * 100;
    const notifType = percentage >= 50 ? 'success' : 'warning';

    return this.create({
      userId: student.parent.userId,
      relatedId: assessmentId,
      relatedType: 'assessment',
      title: `درجة جديدة - ${student.firstName}`,
      message: `حصل ${student.firstName} على ${score}/${maxScore} (${percentage.toFixed(0)}%) في ${assessmentTitle} - مادة ${subjectName}`,
      type: notifType as any,
      channel: 'push',
    });
  }

  // ==================== إشعارات المدفوعات ====================
  async notifyNewPayment(studentId: number, amount: number, dueDate: string, paymentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });
    if (!student?.parent?.userId) return;

    return this.create({
      userId: student.parent.userId,
      relatedId: paymentId,
      relatedType: 'payment',
      title: `مستحق مالي جديد - ${student.firstName}`,
      message: `تم إنشاء مستحق مالي بقيمة ${amount} ليرة سوري - تاريخ الاستحقاق: ${dueDate}`,
      type: 'info',
      channel: 'push',
    });
  }

  async notifyPaymentConfirmed(studentId: number, amount: number, receiptNumber: string, paymentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });
    if (!student?.parent?.userId) return;

    return this.create({
      userId: student.parent.userId,
      relatedId: paymentId,
      relatedType: 'payment',
      title: `تأكيد دفع - ${student.firstName}`,
      message: `تم تأكيد دفع مبلغ ${amount} ليرة سوري. رقم الإيصال: ${receiptNumber}`,
      type: 'success',
      channel: 'push',
    });
  }

  async notifyOverduePayment(studentId: number, amount: number, dueDate: string, paymentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { parent: { include: { user: true } } },
    });
    if (!student?.parent?.userId) return;

    return this.create({
      userId: student.parent.userId,
      relatedId: paymentId,
      relatedType: 'payment',
      title: `تذكير بمستحق متأخر - ${student.firstName}`,
      message: `يوجد مستحق مالي متأخر بقيمة ${amount} ليرة سوري  كان مستحقاً في ${dueDate}`,
      type: 'alert',
      channel: 'push',
    });
  }

  // ==================== إشعارات تسجيل الطالب ====================
  async notifyStudentRegistered(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        parent: { include: { user: true } },
        section: { include: { grade: true } },
      },
    });
    if (!student?.parent?.userId) return;

    const sectionInfo = student.section
      ? `${student.section.grade?.name} - ${student.section.name}`
      : 'لم يتم تحديد الشعبة بعد';

    return this.create({
      userId: student.parent.userId,
      relatedId: student.id,
      relatedType: 'general',
      title: `تم تسجيل الطالب`,
      message: `تم تسجيل ${student.firstName} ${student.lastName} بنجاح في ${sectionInfo}`,
      type: 'success',
      channel: 'push',
    });
  }

  // ==================== الدوال العامة ====================
  async findByUser(userId: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(userId: number) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unreadCount: count };
  }

  async markAsRead(id: number) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('الإشعار غير موجود');

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
  }

  async remove(id: number) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('الإشعار غير موجود');

    await this.prisma.notification.delete({ where: { id } });
    return { message: 'تم حذف الإشعار بنجاح' };
  }

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