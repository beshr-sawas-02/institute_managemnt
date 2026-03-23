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
let NotificationsService = class NotificationsService {
    constructor(prisma, firebaseService) {
        this.prisma = prisma;
        this.firebaseService = firebaseService;
    }
    async create(dto) {
        const notification = await this.prisma.notification.create({
            data: {
                userId: dto.userId,
                relatedId: dto.relatedId,
                relatedType: dto.relatedType,
                title: dto.title,
                message: dto.message,
                type: dto.type || 'info',
                channel: dto.channel || 'in_app',
                data: dto.data ?? undefined,
            },
        });
        if (dto.channel === 'push') {
            try {
                await this.firebaseService.sendToTopic(`user_${dto.userId}`, dto.title, dto.message, {
                    notificationId: notification.id.toString(),
                    relatedType: dto.relatedType || 'general',
                    relatedId: dto.relatedId?.toString() || '',
                });
                await this.prisma.notification.update({
                    where: { id: notification.id },
                    data: { sent: true, sentAt: new Date() },
                });
            }
            catch (error) {
                console.error('فشل إرسال إشعار Firebase:', error);
            }
        }
        return notification;
    }
    async notifyAbsence(studentId, attendanceId) {
        try {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { parent: { include: { user: true } } },
            });
            if (!student?.parent?.user)
                return;
            await this.create({
                userId: student.parent.user.id,
                relatedId: attendanceId,
                relatedType: 'attendance',
                title: 'غياب طالب',
                message: `ابنكم ${student.firstName} ${student.lastName} غائب اليوم`,
                type: 'warning',
                channel: 'push',
            });
        }
        catch (error) {
            console.error('خطأ في إشعار الغياب:', error);
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
            await this.create({
                userId: student.parent.user.id,
                relatedId: attendanceId,
                relatedType: 'attendance',
                title: 'تأخر طالب',
                message: `ابنكم ${student.firstName} ${student.lastName} متأخر ${lateMinutes} دقيقة اليوم`,
                type: 'warning',
                channel: 'push',
            });
        }
        catch (error) {
            console.error('خطأ في إشعار التأخير:', error);
        }
    }
    async notifyNewAssessment(studentId, assessmentTitle, score, maxScore, subjectName, assessmentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.userId)
            return;
        const percentage = (score / maxScore) * 100;
        const notifType = percentage >= 50 ? 'success' : 'warning';
        return this.create({
            userId: student.parent.userId,
            relatedId: assessmentId,
            relatedType: 'assessment',
            title: `درجة جديدة - ${student.firstName}`,
            message: `حصل ${student.firstName} على ${score}/${maxScore} (${percentage.toFixed(0)}%) في ${assessmentTitle} - مادة ${subjectName}`,
            type: notifType,
            channel: 'push',
        });
    }
    async notifyNewPaymentWithBalance(studentId, amount, dueDate, paymentId, balance) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.userId)
            return;
        let message = `تم إنشاء مستحق مالي بقيمة ${amount.toLocaleString()} ل.س - تاريخ الاستحقاق: ${dueDate}`;
        if (balance) {
            message += `\n\n📊 ملخص الحساب (${balance.gradeName}):`;
            message += `\n✅ إجمالي المدفوع: ${balance.totalPaid.toLocaleString()} ل.س`;
            message += `\n⏳ المتبقي: ${balance.remaining.toLocaleString()} ل.س`;
            message += `\n📋 القسط السنوي: ${balance.annualAmount.toLocaleString()} ل.س`;
        }
        return this.create({
            userId: student.parent.userId,
            relatedId: paymentId,
            relatedType: 'payment',
            title: `مستحق مالي جديد - ${student.firstName}`,
            message,
            type: 'info',
            channel: 'push',
        });
    }
    async notifyPaymentConfirmedWithBalance(studentId, amount, receiptNumber, paymentId, balance) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.userId)
            return;
        let message = `تم تأكيد دفع مبلغ ${amount.toLocaleString()} ل.س. رقم الإيصال: ${receiptNumber}`;
        if (balance) {
            message += `\n\n📊 ملخص الحساب (${balance.gradeName}):`;
            message += `\n✅ إجمالي المدفوع: ${balance.totalPaid.toLocaleString()} ل.س`;
            message += `\n⏳ المتبقي: ${balance.remaining.toLocaleString()} ل.س`;
            message += `\n📋 القسط السنوي: ${balance.annualAmount.toLocaleString()} ل.س`;
            if (balance.remaining <= 0) {
                message += `\n\n🎉 تم سداد القسط السنوي بالكامل!`;
            }
        }
        return this.create({
            userId: student.parent.userId,
            relatedId: paymentId,
            relatedType: 'payment',
            title: `تأكيد دفع - ${student.firstName}`,
            message,
            type: 'success',
            channel: 'push',
        });
    }
    async notifyOverduePayment(studentId, amount, dueDate, paymentId) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { parent: { include: { user: true } } },
        });
        if (!student?.parent?.userId)
            return;
        return this.create({
            userId: student.parent.userId,
            relatedId: paymentId,
            relatedType: 'payment',
            title: `تذكير بمستحق متأخر - ${student.firstName}`,
            message: `يوجد مستحق مالي متأخر بقيمة ${amount} ل.س كان مستحقاً في ${dueDate}`,
            type: 'alert',
            channel: 'push',
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
        if (!student?.parent?.userId)
            return;
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
    async findByUser(userId) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
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
        if (!notification)
            throw new common_1.NotFoundException('الإشعار غير موجود');
        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
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
        if (!notification)
            throw new common_1.NotFoundException('الإشعار غير موجود');
        await this.prisma.notification.delete({ where: { id } });
        return { message: 'تم حذف الإشعار بنجاح' };
    }
    async sendBulkNotification(role, title, message, relatedType) {
        const users = await this.prisma.user.findMany({
            where: { role: role, isActive: true },
            select: { id: true },
        });
        const notifications = await Promise.all(users.map((user) => this.create({
            userId: user.id,
            title,
            message,
            type: 'info',
            channel: 'push',
            relatedType,
        })));
        return {
            message: `تم إرسال ${notifications.length} إشعار بنجاح`,
            count: notifications.length,
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