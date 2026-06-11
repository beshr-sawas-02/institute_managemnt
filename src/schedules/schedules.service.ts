import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(orgId: number, dto: CreateScheduleDto) {
    await this.validateRelations(orgId, dto.sectionId, dto.gradeSubjectId);

    const startTime = new Date(`1970-01-01T${dto.startTime}:00`);
    const endTime = new Date(`1970-01-01T${dto.endTime}:00`);

    const sectionConflict = await this.prisma.schedule.findFirst({
      where: {
        sectionId: dto.sectionId,
        dayOfWeek: dto.dayOfWeek,
        status: 'scheduled',
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });
    if (sectionConflict) {
      throw new BadRequestException(
        'يوجد تضارب في الجدول الزمني لهذه الشعبة في هذا الوقت',
      );
    }

    const gradeSubject = await this.prisma.gradeSubject.findUnique({
      where: { id: dto.gradeSubjectId },
      select: { teacherId: true },
    });

    if (gradeSubject?.teacherId) {
      const teacherConflict = await this.prisma.schedule.findFirst({
        where: {
          dayOfWeek: dto.dayOfWeek,
          status: 'scheduled',
          gradeSubject: { teacherId: gradeSubject.teacherId },
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      });
      if (teacherConflict) {
        throw new BadRequestException(
          'المعلم لديه حصة أخرى تتداخل مع هذا الوقت',
        );
      }
    }

    return this.prisma.schedule.create({
      data: { ...dto, startTime, endTime },
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
    });
  }

  async findAll(orgId: number) {
    return this.prisma.schedule.findMany({
      where: { section: { organizationId: orgId } },
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findBySection(orgId: number, sectionId: number) {
    return this.prisma.schedule.findMany({
      where: {
        sectionId,
        status: 'scheduled',
        section: { organizationId: orgId },
      },
      include: {
        gradeSubject: { include: { subject: true, teacher: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findByTeacher(orgId: number, teacherId: number) {
    return this.prisma.schedule.findMany({
      where: {
        gradeSubject: { teacherId },
        status: 'scheduled',
        section: { organizationId: orgId },
      },
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findOne(orgId: number, id: number) {
    const schedule = await this.prisma.schedule.findFirst({
      where: { id, section: { organizationId: orgId } },
      include: {
        section: { include: { grade: true } },
        gradeSubject: { include: { subject: true, teacher: true } },
      },
    });
    if (!schedule) throw new NotFoundException('الحصة غير موجودة');
    return schedule;
  }

  async update(orgId: number, id: number, dto: UpdateScheduleDto) {
    const existing = await this.findOne(orgId, id);

    const newStartTime = dto.startTime
      ? new Date(`1970-01-01T${dto.startTime}:00`)
      : existing.startTime;
    const newEndTime = dto.endTime
      ? new Date(`1970-01-01T${dto.endTime}:00`)
      : existing.endTime;
    const newDayOfWeek = dto.dayOfWeek || existing.dayOfWeek;
    const newGradeSubjectId = dto.gradeSubjectId || existing.gradeSubjectId;
    const newSectionId = dto.sectionId || existing.sectionId;
    await this.validateRelations(orgId, newSectionId, newGradeSubjectId);

    const sectionConflict = await this.prisma.schedule.findFirst({
      where: {
        id: { not: id },
        sectionId: newSectionId,
        dayOfWeek: newDayOfWeek,
        status: 'scheduled',
        AND: [
          { startTime: { lt: newEndTime } },
          { endTime: { gt: newStartTime } },
        ],
      },
    });
    if (sectionConflict) {
      throw new BadRequestException(
        'يوجد تضارب في الجدول الزمني لهذه الشعبة في هذا الوقت',
      );
    }

    const gradeSubject = await this.prisma.gradeSubject.findUnique({
      where: { id: newGradeSubjectId },
      select: { teacherId: true },
    });

    if (gradeSubject?.teacherId) {
      const teacherConflict = await this.prisma.schedule.findFirst({
        where: {
          id: { not: id },
          dayOfWeek: newDayOfWeek,
          status: 'scheduled',
          gradeSubject: { teacherId: gradeSubject.teacherId },
          AND: [
            { startTime: { lt: newEndTime } },
            { endTime: { gt: newStartTime } },
          ],
        },
      });
      if (teacherConflict) {
        throw new BadRequestException(
          'المعلم لديه حصة أخرى تتداخل مع هذا الوقت',
        );
      }
    }

    const data: any = { ...dto };
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

  private async validateRelations(
    orgId: number,
    sectionId: number,
    gradeSubjectId: number,
  ) {
    const [section, gradeSubject] = await Promise.all([
      this.prisma.section.findFirst({
        where: { id: sectionId, organizationId: orgId },
        select: { id: true },
      }),
      this.prisma.gradeSubject.findFirst({
        where: { id: gradeSubjectId, grade: { organizationId: orgId } },
        select: { id: true },
      }),
    ]);

    if (!section || !gradeSubject) {
      throw new NotFoundException('إحدى بيانات الجدول لا تتبع هذه المؤسسة');
    }
  }

  async remove(orgId: number, id: number) {
    await this.findOne(orgId, id);
    await this.prisma.schedule.delete({ where: { id } });
    return { message: 'تم حذف الحصة بنجاح' };
  }
}
