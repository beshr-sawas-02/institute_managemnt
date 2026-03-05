import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  BulkAttendanceDto,
  AttendanceFilterDto,
} from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateAttendanceDto) {
    const attendance = await this.prisma.attendance.create({
      data: { ...dto, date: new Date(dto.date) },
      include: {
        student: { include: { parent: { include: { user: true } } } },
        schedule: { include: { gradeSubject: { include: { subject: true } } } },
      },
    });

    await this.handleAttendanceNotification(attendance);
    return attendance;
  }

  async bulkCreate(dto: BulkAttendanceDto) {
    const results: any[] = [];

    for (const studentData of dto.students) {
      const attendance = await this.prisma.attendance.upsert({
        where: {
          unique_attendance: {
            studentId: studentData.studentId,
            scheduleId: dto.scheduleId,
            date: new Date(dto.date),
          },
        },
        update: {
          status: studentData.status,
          lateMinutes: studentData.lateMinutes || 0,
          notes: studentData.notes,
        },
        create: {
          studentId: studentData.studentId,
          scheduleId: dto.scheduleId,
          date: new Date(dto.date),
          status: studentData.status,
          lateMinutes: studentData.lateMinutes || 0,
          notes: studentData.notes,
        },
        include: {
          student: { include: { parent: { include: { user: true } } } },
          schedule: { include: { gradeSubject: { include: { subject: true } } } },
        },
      });

      results.push(attendance);
      await this.handleAttendanceNotification(attendance);
    }

    return {
      message: `تم تسجيل حضور ${results.length} طالب بنجاح`,
      data: results,
    };
  }

  async findAll(filter: AttendanceFilterDto) {
    const where: any = {};
    if (filter.studentId) where.studentId = filter.studentId;
    if (filter.scheduleId) where.scheduleId = filter.scheduleId;
    if (filter.status) where.status = filter.status;
    if (filter.dateFrom || filter.dateTo) {
      where.date = {};
      if (filter.dateFrom) where.date.gte = new Date(filter.dateFrom);
      if (filter.dateTo) where.date.lte = new Date(filter.dateTo);
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        schedule: {
          include: {
            section: true,
            gradeSubject: { include: { subject: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getStudentStats(studentId: number, dateFrom?: string, dateTo?: string) {
    const where: any = { studentId };
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const [total, present, absent, late, excused] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.count({ where: { ...where, status: 'present' } }),
      this.prisma.attendance.count({ where: { ...where, status: 'absent' } }),
      this.prisma.attendance.count({ where: { ...where, status: 'late' } }),
      this.prisma.attendance.count({ where: { ...where, status: 'excused' } }),
    ]);

    return {
      studentId,
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate: total > 0 ? (((present + late) / total) * 100).toFixed(2) : '0',
    };
  }

  async findOne(id: number) {
    const att = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        student: true,
        schedule: { include: { gradeSubject: { include: { subject: true } } } },
      },
    });
    if (!att) throw new NotFoundException('سجل الحضور غير موجود');
    return att;
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.date) data.date = new Date(dto.date);

    return this.prisma.attendance.update({
      where: { id },
      data,
      include: { student: true, schedule: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.attendance.delete({ where: { id } });
    return { message: 'تم حذف سجل الحضور بنجاح' };
  }

  private async handleAttendanceNotification(attendance: any) {
    const subjectName = attendance.schedule?.gradeSubject?.subject?.name || '';

    if (attendance.status === 'absent') {
      await this.notificationsService.notifyAbsence(
        attendance.studentId,
        subjectName,
        attendance.id,
      );
    } else if (attendance.status === 'late') {
      await this.notificationsService.notifyLate(
        attendance.studentId,
        subjectName,
        attendance.lateMinutes,
        attendance.id,
      );
    }

    // تحديث حالة الإشعار
    if (attendance.status === 'absent' || attendance.status === 'late') {
      await this.prisma.attendance.update({
        where: { id: attendance.id },
        data: { parentNotified: true, notificationSentAt: new Date() },
      });
    }
  }
}