import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class FirebaseService implements OnModuleInit {
    private configService;
    private firebaseApp;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    sendToDevice(token: string, title: string, body: string, data?: Record<string, string>): Promise<string | null>;
    sendToMultipleDevices(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<import("firebase-admin/lib/messaging/messaging-api").BatchResponse | null>;
    sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>): Promise<string | null>;
    subscribeToTopic(tokens: string[], topic: string): Promise<import("firebase-admin/lib/messaging/messaging-api").MessagingTopicManagementResponse | null>;
    unsubscribeFromTopic(tokens: string[], topic: string): Promise<import("firebase-admin/lib/messaging/messaging-api").MessagingTopicManagementResponse | null>;
}
