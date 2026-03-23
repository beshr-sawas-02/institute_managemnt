// src/notifications/firebase.service.ts
// خدمة Firebase للإشعارات الفورية (Push Notifications)

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // تحقق إذا Firebase محضّر من قبل
    if (admin.apps.length > 0) {
      this.firebaseApp = admin.apps[0]!;
      console.log('🔥 Firebase موجود مسبقاً');
      return;
    }

    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const privateKey = this.configService
      .get<string>('FIREBASE_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

    if (projectId && privateKey && clientEmail) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });
      console.log('🔥 تم تهيئة Firebase بنجاح');
    } else {
      console.warn('⚠️ إعدادات Firebase غير مكتملة - الإشعارات الفورية معطلة');
    }
  }

  // إرسال إشعار لجهاز واحد
  async sendToDevice(token: string, title: string, body: string, data?: Record<string, string>) {
    if (!this.firebaseApp) {
      console.warn('Firebase غير مهيأ');
      return null;
    }

    try {
      const message: admin.messaging.Message = {
        token,
        notification: { title, body },
        data: data || {},
        android: {
          priority: 'high',
          notification: { sound: 'default' },
        },
        apns: {
          payload: { aps: { sound: 'default', badge: 1 } },
        },
      };

      const response = await admin.messaging().send(message);
      console.log(`✅ تم إرسال الإشعار: ${response}`);
      return response;
    } catch (error) {
      console.error('❌ خطأ في إرسال الإشعار:', error);
      return null;
    }
  }

  // إرسال إشعار لعدة أجهزة
  async sendToMultipleDevices(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    if (!this.firebaseApp || tokens.length === 0) return null;

    try {
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: { title, body },
        data: data || {},
        android: {
          priority: 'high',
          notification: { sound: 'default' },
        },
        apns: {
          payload: { aps: { sound: 'default', badge: 1 } },
        },
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`✅ تم إرسال ${response.successCount} إشعار من أصل ${tokens.length}`);
      return response;
    } catch (error) {
      console.error('❌ خطأ في إرسال الإشعارات:', error);
      return null;
    }
  }

  // إرسال إشعار لموضوع (Topic)
  async sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>) {
    if (!this.firebaseApp) return null;

    try {
      const message: admin.messaging.Message = {
        topic,
        notification: { title, body },
        data: data || {},
      };

      return await admin.messaging().send(message);
    } catch (error) {
      console.error('❌ خطأ في إرسال الإشعار للموضوع:', error);
      return null;
    }
  }

  // الاشتراك في موضوع
  async subscribeToTopic(tokens: string[], topic: string) {
    if (!this.firebaseApp) return null;
    return admin.messaging().subscribeToTopic(tokens, topic);
  }

  // إلغاء الاشتراك من موضوع
  async unsubscribeFromTopic(tokens: string[], topic: string) {
    if (!this.firebaseApp) return null;
    return admin.messaging().unsubscribeFromTopic(tokens, topic);
  }
}