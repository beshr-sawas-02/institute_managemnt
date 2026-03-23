import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
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
    sendBulk(body: {
        role: string;
        title: string;
        message: string;
    }): Promise<{
        message: string;
        count: number;
    }>;
    findMyNotifications(userId: number): Promise<{
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
}
