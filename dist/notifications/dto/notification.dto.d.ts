import { NotificationRelatedType, NotificationType, NotificationChannel } from '@prisma/client';
export declare class CreateNotificationDto {
    userId: number;
    relatedId?: number;
    relatedType?: NotificationRelatedType;
    title: string;
    message: string;
    type?: NotificationType;
    channel?: NotificationChannel;
    data?: Record<string, any>;
}
