// src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    // Global Filters
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global Interceptors
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Global Validation
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

    // Enable CORS
    app.enableCors();

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('نظام إدارة المدرسة')
      .setDescription('واجهة برمجية لنظام إدارة المدرسة الشامل')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.init();

    // تحويل NestJS إلى handler يعمل على Vercel
    cachedServer = app.getHttpAdapter().getInstance();
  }

  return cachedServer;
}

// Handler لبيئة Serverless في Vercel
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}