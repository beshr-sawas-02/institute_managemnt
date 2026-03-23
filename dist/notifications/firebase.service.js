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
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
let FirebaseService = class FirebaseService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        if (admin.apps.length > 0) {
            this.firebaseApp = admin.apps[0];
            console.log('🔥 Firebase موجود مسبقاً');
            return;
        }
        const projectId = this.configService.get('FIREBASE_PROJECT_ID');
        const privateKey = this.configService
            .get('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n');
        const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');
        if (projectId && privateKey && clientEmail) {
            this.firebaseApp = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    privateKey,
                    clientEmail,
                }),
            });
            console.log('🔥 تم تهيئة Firebase بنجاح');
        }
        else {
            console.warn('⚠️ إعدادات Firebase غير مكتملة - الإشعارات الفورية معطلة');
        }
    }
    async sendToDevice(token, title, body, data) {
        if (!this.firebaseApp) {
            console.warn('Firebase غير مهيأ');
            return null;
        }
        try {
            const message = {
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
        }
        catch (error) {
            console.error('❌ خطأ في إرسال الإشعار:', error);
            return null;
        }
    }
    async sendToMultipleDevices(tokens, title, body, data) {
        if (!this.firebaseApp || tokens.length === 0)
            return null;
        try {
            const message = {
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
        }
        catch (error) {
            console.error('❌ خطأ في إرسال الإشعارات:', error);
            return null;
        }
    }
    async sendToTopic(topic, title, body, data) {
        if (!this.firebaseApp)
            return null;
        try {
            const message = {
                topic,
                notification: { title, body },
                data: data || {},
            };
            return await admin.messaging().send(message);
        }
        catch (error) {
            console.error('❌ خطأ في إرسال الإشعار للموضوع:', error);
            return null;
        }
    }
    async subscribeToTopic(tokens, topic) {
        if (!this.firebaseApp)
            return null;
        return admin.messaging().subscribeToTopic(tokens, topic);
    }
    async unsubscribeFromTopic(tokens, topic) {
        if (!this.firebaseApp)
            return null;
        return admin.messaging().unsubscribeFromTopic(tokens, topic);
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map