// src/prisma/prisma.module.ts
// وحدة Prisma - متاحة عالمياً لكل الوحدات

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}