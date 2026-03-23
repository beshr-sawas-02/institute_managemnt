import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
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

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('نظام إدارة المدرسة')
    .setDescription('واجهة برمجية لنظام إدارة المدرسة الشامل')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.init();
  cachedServer = app.getHttpAdapter().getInstance();
  return cachedServer;
}

// للتشغيل المحلي
if (process.env.NODE_ENV !== 'production') {
  NestFactory.create(AppModule).then(async (app) => {
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.enableCors();
    await app.listen(3000);
    console.log('Server running on http://localhost:3000');
  });
}

// Handler لـ Vercel
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}

module.exports = handler;