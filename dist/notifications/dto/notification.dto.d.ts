import { NotificationChannel, NotificationRelatedType, NotificationType, UserRole } from '@prisma/client';
export declare class CreateNotificationDto {
    userId: number;
    relatedId?: number;
    relatedType?: NotificationRelatedType;
    title?: string;
    titleEn?: string;
    titleAr?: string;
    message?: string;
    messageEn?: string;
    messageAr?: string;
    type?: NotificationType;
    channel?: NotificationChannel;
    data?: Record<string, any>;
}
export declare class BulkNotificationDto {
    role: UserRole;
    title?: string;
    titleEn?: string;
    titleAr?: string;
    message?: string;
    messageEn?: string;
    messageAr?: string;
    relatedType?: NotificationRelatedType;
}
