// src/prisma/prisma.service.ts
// خدمة Prisma للاتصال بقاعدة البيانات

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected');

    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
  }
}
