import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from './firebase.service';
import { CreateNotificationDto } from './dto/notification.dto';
type StudentBalance = {
    annualAmount: number;
    totalPaid: number;
    remaining: number;
    gradeName: string;
} | null;
export declare class NotificationsService {
    private prisma;
    private firebaseService;
    constructor(prisma: PrismaService, firebaseService: FirebaseService);
    create(dto: CreateNotificationDto): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    }>;
    notifyAbsence(studentId: number, attendanceId: number): Promise<void>;
    notifyLate(studentId: number, lateMinutes: number, attendanceId: number): Promise<void>;
    notifyNewAssessment(studentId: number, assessmentTitle: string, score: number, maxScore: number, subjectName: string, assessmentId: number): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    } | undefined>;
    notifyNewPaymentWithBalance(studentId: number, amount: number, dueDate: string, paymentId: number, balance: StudentBalance): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    } | undefined>;
    notifyPaymentConfirmedWithBalance(studentId: number, amount: number, receiptNumber: string, paymentId: number, balance: StudentBalance): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    } | undefined>;
    notifyOverduePayment(studentId: number, amount: number, dueDate: string, paymentId: number): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    } | undefined>;
    notifyStudentRegistered(studentId: number): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    } | undefined>;
    findByUser(userId: number): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    }[]>;
    getUnreadCount(userId: number): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: number): Promise<{
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: number;
        relatedId: number | null;
        relatedType: import(".prisma/client").$Enums.NotificationRelatedType | null;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        isRead: boolean;
        readAt: Date | null;
        sent: boolean;
        sentAt: Date | null;
    }>;
    markAllAsRead(userId: number): Promise<{
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    sendBulkNotification(role: string, title: string, message: string, relatedType?: any): Promise<{
        message: string;
        count: number;
    }>;
}
export {};
