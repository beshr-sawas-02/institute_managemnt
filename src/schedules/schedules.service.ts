// src/schedules/schedules.service.ts
// خدمة إدارة الجداول الزمنية

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto) {
    // التحقق من عدم وجود تعارض في الجدول
    const conflict = await this.prisma.schedule.findFirst({
      where: {
        sectionId: dto.sectionId,
        dayOfWeek: dto.dayOfWeek,
        status: 'scheduled',
        OR: [
          {
            startTime: { lte: new Date(`1970-01-01T${dto.endTime}:00`) },
            endTime: { gte: new Date(`1970-01-01T${dto.startTime}:00`) },
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('يوجد تعارض في الجدول الزمني لهذه الشعبة');
    }

    return this.prisma.schedule.create({
      data: {
        ...dto,
        startTime: new Date(`1970-01-01T${dto.startTime}:00`),
        endTime: new Date(`1970-01-01T${dto.endTime}:00`),
      },
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.schedule.findMany({
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findBySection(sectionId: number) {
    return this.prisma.schedule.findMany({
      where: { sectionId, status: 'scheduled' },
      include: {
        gradeSubject: { include: { subject: true, teacher: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findByTeacher(teacherId: number) {
    return this.prisma.schedule.findMany({
      where: {
        gradeSubject: { teacherId },
        status: 'scheduled',
      },
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findOne(id: number) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
    });
    if (!schedule) throw new NotFoundException('الحصة غير موجودة');
    return schedule;
  }

  async update(id: number, dto: UpdateScheduleDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.startTime) data.startTime = new Date(`1970-01-01T${dto.startTime}:00`);
    if (dto.endTime) data.endTime = new Date(`1970-01-01T${dto.endTime}:00`);

    return this.prisma.schedule.update({
      where: { id },
      data,
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.schedule.delete({ where: { id } });
    return { message: 'تم حذف الحصة بنجاح' };
  }
}