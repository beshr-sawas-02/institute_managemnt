// src/main.ts
// نقطة الدخول الرئيسية للتطبيق

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // تفعيل فلتر الأخطاء العالمي
  app.useGlobalFilters(new AllExceptionsFilter());

  // تفعيل معترض الاستجابة العالمي
  app.useGlobalInterceptors(new ResponseInterceptor());

  // تفعيل التحقق من البيانات عالمياً
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // تفعيل CORS
  app.enableCors();

  // إعداد Swagger للتوثيق
  const config = new DocumentBuilder()
    .setTitle('نظام إدارة المدرسة')
    .setDescription('واجهة برمجية لنظام إدارة المدرسة الشامل')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);

  console.log(`🚀 التطبيق يعمل على المنفذ: ${port}`);
  console.log(`📚 توثيق Swagger متاح على: http://localhost:${port}/docs`);
}

bootstrap();
