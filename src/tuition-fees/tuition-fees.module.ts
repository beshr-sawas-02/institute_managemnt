// src/tuition-fees/tuition-fees.module.ts

import { Module } from '@nestjs/common';
import { TuitionFeesService } from './tuition-fees.service';
import { TuitionFeesController } from './tuition-fees.controller';

@Module({
  controllers: [TuitionFeesController],
  providers: [TuitionFeesService],
  exports: [TuitionFeesService],
})
export class TuitionFeesModule {}