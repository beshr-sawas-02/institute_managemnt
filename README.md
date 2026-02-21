# 🏫 نظام إدارة المدرسة - النظام الخلفي

نظام خلفي شامل لإدارة المدرسة مبني باستخدام **NestJS** مع **Prisma ORM** و **Firebase Cloud Messaging**.

## 📋 المميزات

- ✅ نظام توثيق كامل (JWT) مع أدوار متعددة (مسؤول، استقبال، معلم، طالب، ولي أمر)
- ✅ إدارة المستخدمين وأولياء الأمور والمعلمين والطلاب
- ✅ إدارة الصفوف والشعب والمواد الدراسية
- ✅ الجداول الزمنية مع كشف التعارضات
- ✅ نظام حضور متقدم (فردي وجماعي) مع إشعارات تلقائية
- ✅ نظام التقييمات والدرجات مع حساب النسب والتقديرات
- ✅ إدارة المدفوعات والمصاريف مع إحصائيات
- ✅ إشعارات Firebase (Push Notifications)
- ✅ نظام تقارير (حضور، مالي، أداء، مقارنة)
- ✅ توثيق API تلقائي عبر Swagger
- ✅ نظام ترقيم (Pagination) وبحث

## 🛠️ التقنيات المستخدمة

| التقنية | الغرض |
|---------|-------|
| NestJS 10 | إطار العمل الخلفي |
| Prisma ORM | قاعدة البيانات |
| MySQL | قاعدة البيانات |
| JWT + Passport | التوثيق |
| Firebase Admin | الإشعارات الفورية |
| Swagger | توثيق API |
| class-validator | التحقق من البيانات |

## 🚀 التشغيل

### المتطلبات
- Node.js 18+
- MySQL 8+
- حساب Firebase (للإشعارات)

### خطوات التثبيت

```bash
# 1. تثبيت الحزم
npm install

# 2. نسخ ملف الإعدادات
cp .env.example .env
# قم بتعديل القيم في .env

# 3. إنشاء قاعدة البيانات وتطبيق الهجرات
npx prisma migrate dev --name init

# 4. بذر قاعدة البيانات ببيانات تجريبية
npx prisma db seed

# 5. تشغيل التطبيق
npm run start:dev
```

### الروابط بعد التشغيل
- **API**: http://localhost:3000/api/v1
- **Swagger**: http://localhost:3000/api/docs

## 📁 هيكل المشروع

```
src/
├── main.ts                    # نقطة الدخول
├── app.module.ts              # الوحدة الرئيسية
├── prisma/                    # خدمة Prisma
├── auth/                      # التوثيق (JWT)
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.module.ts
├── common/                    # مكونات مشتركة
│   ├── decorators/            # المزخرفات
│   ├── guards/                # الحراس
│   ├── filters/               # الفلاتر
│   ├── interceptors/          # المعترضات
│   └── dto/                   # DTOs مشتركة
├── users/                     # المستخدمون
├── parents/                   # أولياء الأمور
├── teachers/                  # المعلمون
├── students/                  # الطلاب
├── grades/                    # الصفوف
├── sections/                  # الشعب
├── subjects/                  # المواد
├── grade-subjects/            # مواد الصفوف
├── schedules/                 # الجداول الزمنية
├── attendance/                # الحضور
├── assessments/               # التقييمات
├── payments/                  # المدفوعات
├── expenses/                  # المصاريف
├── notifications/             # الإشعارات + Firebase
└── reports/                   # التقارير
prisma/
├── schema.prisma              # مخطط قاعدة البيانات
└── seed.ts                    # بيانات تجريبية
```

## 🔐 بيانات الدخول التجريبية

| الدور | البريد | كلمة المرور |
|-------|--------|------------|
| مسؤول | admin@school.com | admin123 |
| استقبال | reception@school.com | reception123 |
| معلم | teacher@school.com | teacher123 |
| ولي أمر | parent@school.com | parent123 |
| طالب | student@school.com | student123 |

## 📡 نقاط النهاية (API Endpoints)

### التوثيق
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| POST | /api/v1/auth/login | تسجيل الدخول |
| POST | /api/v1/auth/register | إنشاء حساب |
| POST | /api/v1/auth/change-password | تغيير كلمة المرور |
| GET | /api/v1/auth/profile | الملف الشخصي |

### كل وحدة تدعم العمليات التالية:
| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | /api/v1/{resource} | جلب الكل (مع ترقيم وبحث) |
| GET | /api/v1/{resource}/:id | جلب بالمعرف |
| POST | /api/v1/{resource} | إنشاء |
| PATCH | /api/v1/{resource}/:id | تحديث |
| DELETE | /api/v1/{resource}/:id | حذف |

### مسارات إضافية:
- `POST /api/v1/attendance/bulk` - تسجيل حضور جماعي
- `GET /api/v1/attendance/stats/:studentId` - إحصائيات حضور طالب
- `GET /api/v1/payments/stats` - إحصائيات المدفوعات
- `GET /api/v1/expenses/stats` - إحصائيات المصاريف
- `GET /api/v1/notifications/my` - إشعاراتي
- `PATCH /api/v1/notifications/read-all` - تحديد الكل كمقروء
- `POST /api/v1/notifications/bulk` - إشعار جماعي

## 🔥 إعداد Firebase

1. انشئ مشروع في [Firebase Console](https://console.firebase.google.com)
2. فعّل Cloud Messaging
3. حمّل ملف Service Account
4. أضف البيانات في ملف `.env`

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```