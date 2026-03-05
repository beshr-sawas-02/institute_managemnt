import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScheduleDto) {
    const startTime = new Date(`1970-01-01T${dto.startTime}:00`);
    const endTime = new Date(`1970-01-01T${dto.endTime}:00`);

    // 1. التحقق من تعارض الشعبة
    const sectionConflict = await this.prisma.schedule.findFirst({
      where: {
        sectionId: dto.sectionId,
        dayOfWeek: dto.dayOfWeek,
        status: 'scheduled',
        startTime: startTime,
      },
    });

    if (sectionConflict) {
      throw new BadRequestException('يوجد تعارض في الجدول الزمني لهذه الشعبة في نفس الوقت');
    }

    // 2. التحقق من تعارض المعلم (نفس المعلم + نفس اليوم + نفس وقت البداية)
    const gradeSubject = await this.prisma.gradeSubject.findUnique({
      where: { id: dto.gradeSubjectId },
      select: { teacherId: true },
    });

    if (gradeSubject?.teacherId) {
      const teacherConflict = await this.prisma.schedule.findFirst({
        where: {
          dayOfWeek: dto.dayOfWeek,
          startTime: startTime,
          status: 'scheduled',
          gradeSubject: {
            teacherId: gradeSubject.teacherId,
          },
        },
      });

      if (teacherConflict) {
        throw new BadRequestException(
          'المعلم لديه حصة أخرى في نفس اليوم ونفس وقت البداية. يوجد تضارب في جدول المعلم',
        );
      }
    }

    return this.prisma.schedule.create({
      data: {
        ...dto,
        startTime,
        endTime,
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
    const existing = await this.findOne(id);
    const data: any = { ...dto };

    const newStartTime = dto.startTime
      ? new Date(`1970-01-01T${dto.startTime}:00`)
      : existing.startTime;
    const newEndTime = dto.endTime
      ? new Date(`1970-01-01T${dto.endTime}:00`)
      : existing.endTime;
    const newDayOfWeek = dto.dayOfWeek || existing.dayOfWeek;
    const newGradeSubjectId = dto.gradeSubjectId || existing.gradeSubjectId;

    // التحقق من تعارض المعلم عند التحديث
    const gradeSubject = await this.prisma.gradeSubject.findUnique({
      where: { id: newGradeSubjectId },
      select: { teacherId: true },
    });

    if (gradeSubject?.teacherId) {
      const teacherConflict = await this.prisma.schedule.findFirst({
        where: {
          id: { not: id }, // استثناء السجل الحالي
          dayOfWeek: newDayOfWeek,
          startTime: newStartTime,
          status: 'scheduled',
          gradeSubject: {
            teacherId: gradeSubject.teacherId,
          },
        },
      });

      if (teacherConflict) {
        throw new BadRequestException(
          'المعلم لديه حصة أخرى في نفس اليوم ونفس وقت البداية. يوجد تضارب في جدول المعلم',
        );
      }
    }

    if (dto.startTime) data.startTime = newStartTime;
    if (dto.endTime) data.endTime = newEndTime;

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