// src/attendance/attendance.service.ts
// خدمة إدارة الحضور مع إشعارات Firebase

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

  // تسجيل حضور طالب واحد
  async create(dto: CreateAttendanceDto) {
    const attendance = await this.prisma.attendance.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
      include: {
        student: {
          include: {
            parent: { include: { user: true } },
          },
        },
        schedule: {
          include: { gradeSubject: { include: { subject: true } } },
        },
      },
    });

    // إرسال إشعار لولي الأمر إذا كان الطالب غائباً أو متأخراً
    if (dto.status === 'absent' || dto.status === 'late') {
      await this.notifyParentAboutAttendance(attendance);
    }

    return attendance;
  }

  // تسجيل حضور مجموعة طلاب دفعة واحدة
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

      // إشعار ولي الأمر بالغياب أو التأخير
      if (studentData.status === 'absent' || studentData.status === 'late') {
        await this.notifyParentAboutAttendance(attendance);
      }
    }

    return {
      message: `تم تسجيل حضور ${results.length} طالب بنجاح`,
      data: results,
    };
  }

  // جلب سجلات الحضور مع الفلترة
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

  // إحصائيات حضور طالب
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
      attendanceRate: total > 0 ? ((present + late) / total * 100).toFixed(2) : '0',
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

  // إرسال إشعار لولي الأمر عن حضور ابنه
  private async notifyParentAboutAttendance(attendance: any) {
    const student = attendance.student;
    const subject = attendance.schedule?.gradeSubject?.subject?.name || '';

    if (!student?.parent?.userId) return;

    const title = `تنبيه حضور - ${student.firstName} ${student.lastName}`;
    const message =
      attendance.status === 'absent'
        ? `ابنكم ${student.firstName} غائب اليوم في مادة ${subject}`
        : `ابنكم ${student.firstName} متأخر ${attendance.lateMinutes} دقيقة في مادة ${subject}`;

    await this.notificationsService.create({
      userId: student.parent.userId,
      relatedId: attendance.id,
      relatedType: 'attendance',
      title,
      message,
      type: 'warning',
      channel: 'push',
    });

    // تحديث حالة إرسال الإشعار
    await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        parentNotified: true,
        notificationSentAt: new Date(),
      },
    });
  }
}