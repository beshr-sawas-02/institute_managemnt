"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const firebase_service_1 = require("./firebase.service");
const notification_localization_1 = require("./notification-localization");
let NotificationsService = class NotificationsService {
    constructor(prisma, firebaseService) {
        this.prisma = prisma;
        this.firebaseService = firebaseService;
    }
    async create(dto) {
        const preferredLanguage = dto.preferredLanguage ?? (await this.getUserPreferredLanguage(dto.userId));
        const localizedContent = this.buildLocalizedContent(dto);
        if (!localizedContent) {
            throw new common_1.BadRequestException('عنوان الإشعار ومحتواه مطلوبان');
        }
        const title = this.resolveLocalizedText(localizedContent.title, preferredLanguage);
        const message = this.resolveLocalizedText(localizedContent.message, preferredLanguage);
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
                await this.firebaseService.sendToTopic(`user_${dto.userId}`, title, message, {
                    notificationId: notification.id.toString(),
                    relatedType: dto.relatedType ?? 'general',
                    relatedId: dto.relatedId?.toString() ?? '',
                });
                await this.prisma.notification.update({
                    where: { id: notification.id },
                    data: { sent: true, sentAt: new Date() },
                });
            }
            catch (error) {
                console.error('Failed to send Firebase notification:', error);
            }
        }
        return this.localizeNotification(notification, preferredLanguage);
    }
    async createLocalizedNotification(dto) {
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
    async notifyAbsence(studentId, attendanceId) {
        try {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { parent: { include: { user: true } } },
            });
            if (!student?.parent?.user)
                return;
            const content = (0, notification_localization_1.buildAbsenceNotification)(`${student.firstName} ${student.lastName}`);
            await this.createLocalizedNotification({
                userId: student.parent.user.id,
                preferredLanguage: student.parent.user.preferredLanguage,
                relatedId: attendanceId,
                relatedType: 'attendance',
                type: 'warning',
                channel: 'push',
                content,
            });
        }
        catch (error) {
            console.error('Attendance absence notification failed:', error);
        }
    }
    async notifyLate(studentId, lateMinutes, attendanceId) {
        try {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { parent: { include: { user: true } } },
            });
            if (!student?.parent?.user)
                return;
            const content = (0, notification_localization_1.buildLateNotification)(`${student.firstName} ${student.lastName}`, lateMinutes);
            await this.createLocalizedNotification({
                userId: student.parent.user.id,
                preferredLanguage: student.parent.user.preferredLanguage,
                relatedId: attendanceId,
                relatedType: 'attendance',
                type: 'warning',
                channel: 'push',
                content,
            });
        }
        catch (error) {
            console.error('Attendance late notification failed:', error);
        }
    }
    async notifyNewAssessment(studentId, assessmentTitle, score, maxScore, subjectName, assessmentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.user)
            return;
        const percentage = (score / maxScore) * 100;
        const notifType = percentage >= 50 ? 'success' : 'warning';
        const content = (0, notification_localization_1.buildAssessmentResultNotification)({
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
            type: notifType,
            channel: 'push',
            content,
        });
    }
    async notifyNewPaymentWithBalance(studentId, amount, dueDate, paymentId, balance) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.user)
            return;
        const content = (0, notification_localization_1.buildNewPaymentNotification)(`${student.firstName} ${student.lastName}`, amount, dueDate, balance);
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
    async notifyPaymentConfirmedWithBalance(studentId, amount, receiptNumber, paymentId, balance) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.user)
            return;
        const content = (0, notification_localization_1.buildPaymentConfirmedNotification)(`${student.firstName} ${student.lastName}`, amount, receiptNumber, balance);
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
    async notifyOverduePayment(studentId, amount, dueDate, paymentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.user)
            return;
        const content = (0, notification_localization_1.buildOverduePaymentNotification)(`${student.firstName} ${student.lastName}`, amount, dueDate);
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
    async notifyStudentRegistered(studentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                parent: { include: { user: true } },
                section: { include: { grade: true } },
            },
        });
        if (!student?.parent?.user)
            return;
        const sectionInfo = student.section
            ? `${student.section.grade?.name} - ${student.section.name}`
            : 'غير محدد';
        const sectionInfoEn = student.section
            ? `${student.section.grade?.name} - ${student.section.name}`
            : 'Section not assigned yet';
        const content = (0, notification_localization_1.buildStudentRegisteredNotification)(`${student.firstName} ${student.lastName}`, sectionInfo, sectionInfoEn);
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
    async findByUser(userId) {
        const [preferredLanguage, notifications] = await Promise.all([
            this.getUserPreferredLanguage(userId),
            this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),
        ]);
        return notifications.map((notification) => this.localizeNotification(notification, preferredLanguage));
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, isRead: false },
        });
        return { unreadCount: count };
    }
    async markAsRead(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('الإشعار غير موجود');
        }
        const updated = await this.prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
        const preferredLanguage = await this.getUserPreferredLanguage(updated.userId);
        return this.localizeNotification(updated, preferredLanguage);
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
        return { message: 'تم تحديد جميع الإشعارات كمقروءة' };
    }
    async remove(id) {
        const notification = await this.prisma.notification.findUnique({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException('الإشعار غير موجود');
        }
        await this.prisma.notification.delete({ where: { id } });
        return { message: 'تم حذف الإشعار بنجاح' };
    }
    async sendBulkNotification(dto) {
        const users = await this.prisma.user.findMany({
            where: { role: dto.role, isActive: true },
            select: { id: true, preferredLanguage: true },
        });
        const notifications = await Promise.all(users.map((user) => this.create({
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
        })));
        return {
            message: `تم إرسال ${notifications.length} إشعار بنجاح`,
            count: notifications.length,
        };
    }
    async getUserPreferredLanguage(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { preferredLanguage: true },
        });
        return user?.preferredLanguage ?? 'ar';
    }
    buildLocalizedContent(dto) {
        const title = this.normalizeLocalizedText(dto.title, dto.titleAr, dto.titleEn);
        const message = this.normalizeLocalizedText(dto.message, dto.messageAr, dto.messageEn);
        if (!title || !message) {
            return null;
        }
        return { title, message };
    }
    normalizeLocalizedText(fallback, arabic, english) {
        const defaultValue = fallback?.trim();
        const ar = arabic?.trim() || defaultValue || english?.trim();
        const en = english?.trim() || defaultValue || arabic?.trim();
        if (!ar || !en) {
            return null;
        }
        return { ar, en };
    }
    resolveLocalizedText(text, language) {
        return language === 'en' ? text.en : text.ar;
    }
    attachLocalizedContent(data, localizedContent) {
        return {
            ...(data ?? {}),
            localizedContent,
        };
    }
    extractLocalizedContent(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            return null;
        }
        const localizedContent = data.localizedContent;
        if (!localizedContent || typeof localizedContent !== 'object') {
            return null;
        }
        if (!localizedContent.title ||
            !localizedContent.message ||
            typeof localizedContent.title.ar !== 'string' ||
            typeof localizedContent.title.en !== 'string' ||
            typeof localizedContent.message.ar !== 'string' ||
            typeof localizedContent.message.en !== 'string') {
            return null;
        }
        return localizedContent;
    }
    localizeNotification(notification, preferredLanguage) {
        const localizedContent = this.extractLocalizedContent(notification.data);
        if (!localizedContent) {
            return notification;
        }
        return {
            ...notification,
            title: this.resolveLocalizedText(localizedContent.title, preferredLanguage),
            message: this.resolveLocalizedText(localizedContent.message, preferredLanguage),
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        firebase_service_1.FirebaseService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map