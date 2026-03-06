import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  CreateAttendanceDto,
  BulkAttendanceDto,
  SmartBulkAttendanceDto,
  UpdateAttendanceDto,
} from './dto/attendance.dto';

type AttendanceResult = {
  order: number;
  studentId: number;
  name: string;
  status: string;
  lateMinutes: number;
};

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ==================== تسجيل فردي ====================
  async create(dto: CreateAttendanceDto) {
    const existing = await this.prisma.attendance.findUnique({
      where: {
        unique_attendance: {
          studentId: dto.studentId,
          date: new Date(dto.date),
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'تم تسجيل حضور هذا الطالب لهذا اليوم مسبقاً',
      );
    }

    const attendance = await this.prisma.attendance.create({
      data: {
        studentId: dto.studentId,
        date: new Date(dto.date),
        status: dto.status,
        lateMinutes: dto.lateMinutes || 0,
        notes: dto.notes,
      },
      include: {
        student: {
          include: {
            parent: {
              include: {
                user: { select: { id: true, email: true, role: true } },
              },
            },
          },
        },
      },
    });

    await this.handleAttendanceNotification(attendance as any);
    return attendance;
  }

  // ==================== تسجيل جماعي يدوي ====================
  async bulkCreate(dto: BulkAttendanceDto) {
    const results: any[] = [];

    for (const studentData of dto.students) {
      const attendance = await this.prisma.attendance.upsert({
        where: {
          unique_attendance: {
            studentId: studentData.studentId,
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
          date: new Date(dto.date),
          status: studentData.status,
          lateMinutes: studentData.lateMinutes || 0,
          notes: studentData.notes,
        },
        include: {
          student: {
            include: {
              parent: {
                include: {
                  user: { select: { id: true, email: true, role: true } },
                },
              },
            },
          },
        },
      });

      await this.handleAttendanceNotification(attendance as any);
      results.push(attendance);
    }

    return {
      message: `تم تسجيل حضور ${results.length} طالب بنجاح`,
      data: results,
    };
  }

  // ==================== كشف الحضور للشعبة ====================
  async getSectionAttendanceSheet(sectionId: number, date: string) {
    const students = await this.prisma.student.findMany({
      where: { sectionId, status: 'active' },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (students.length === 0) {
      throw new NotFoundException('لا يوجد طلاب في هذه الشعبة');
    }

    const existingRecords = await this.prisma.attendance.findMany({
      where: {
        date: new Date(date),
        studentId: { in: students.map((s) => s.id) },
      },
    });

    const recordMap = new Map(existingRecords.map((r) => [r.studentId, r]));

    return {
      sectionId,
      date,
      totalStudents: students.length,
      registered: existingRecords.length,
      isComplete: existingRecords.length === students.length,
      students: students.map((student, index) => ({
        order: index + 1,
        studentId: student.id,
        name: `${student.firstName} ${student.lastName}`,
        attendance: recordMap.get(student.id) || null,
      })),
    };
  }

  // ==================== تسجيل ذكي ====================
  async smartBulkCreate(dto: SmartBulkAttendanceDto) {
    const students = await this.prisma.student.findMany({
      where: { sectionId: dto.sectionId, status: 'active' },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      include: {
        parent: {
          include: {
            user: { select: { id: true, email: true, role: true } },
          },
        },
      },
    });

    if (students.length === 0) {
      throw new NotFoundException('لا يوجد طلاب في هذه الشعبة');
    }

    const exceptionsMap = new Map(
      (dto.exceptions || []).map((e) => [e.studentId, e]),
    );

    const results: AttendanceResult[] = [];

    for (const student of students) {
      const exception = exceptionsMap.get(student.id);

      const attendanceData = {
        studentId: student.id,
        date: new Date(dto.date),
        status: exception ? exception.status : ('present' as const),
        lateMinutes: exception?.lateMinutes || 0,
        notes: exception?.notes || null,
      };

      const attendance = await this.prisma.attendance.upsert({
        where: {
          unique_attendance: {
            studentId: student.id,
            date: new Date(dto.date),
          },
        },
        update: {
          status: attendanceData.status,
          lateMinutes: attendanceData.lateMinutes,
          notes: attendanceData.notes,
        },
        create: {
          studentId: attendanceData.studentId,
          date: attendanceData.date,
          status: attendanceData.status,
          lateMinutes: attendanceData.lateMinutes,
          notes: attendanceData.notes,
        },
        include: {
          student: {
            include: {
              parent: {
                include: {
                  user: { select: { id: true, email: true, role: true } },
                },
              },
            },
          },
        },
      });

      await this.handleAttendanceNotification(attendance as any);

      results.push({
        order: results.length + 1,
        studentId: student.id,
        name: `${student.firstName} ${student.lastName}`,
        status: attendance.status as string,
        lateMinutes: attendance.lateMinutes,
      });
    }

    const summary = {
      total: results.length,
      present: results.filter((r) => r.status === 'present').length,
      absent: results.filter((r) => r.status === 'absent').length,
      late: results.filter((r) => r.status === 'late').length,
      excused: results.filter((r) => r.status === 'excused').length,
    };

    return {
      message: `تم تسجيل حضور ${students.length} طالب بنجاح`,
      date: dto.date,
      sectionId: dto.sectionId,
      summary,
      data: results,
    };
  }

  // ==================== جلب السجلات ====================
  async findAll(filters?: { date?: string; sectionId?: number }) {
    const where: any = {};

    if (filters?.date) {
      where.date = new Date(filters.date);
    }

    if (filters?.sectionId) {
      where.student = { sectionId: filters.sectionId };
    }

    return this.prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            section: { include: { grade: true } },
          },
        },
      },
      orderBy: [{ date: 'desc' }, { studentId: 'asc' }],
    });
  }

  async findByStudent(studentId: number, dateFrom?: string, dateTo?: string) {
    const where: any = { studentId };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    return this.prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findBySection(sectionId: number, date: string) {
    return this.prisma.attendance.findMany({
      where: {
        date: new Date(date),
        student: { sectionId },
      },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { studentId: 'asc' },
    });
  }

  async findOne(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
    if (!attendance) throw new NotFoundException('سجل الحضور غير موجود');
    return attendance;
  }

  // ==================== تعديل وحذف ====================
  async update(id: number, dto: UpdateAttendanceDto) {
    await this.findOne(id);
    return this.prisma.attendance.update({
      where: { id },
      data: dto,
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.attendance.delete({ where: { id } });
    return { message: 'تم حذف سجل الحضور بنجاح' };
  }

  // ==================== إحصائيات ====================
  async getStats(studentId: number, dateFrom?: string, dateTo?: string) {
    const where: any = { studentId };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const records = await this.prisma.attendance.findMany({ where });

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;
    const excused = records.filter((r) => r.status === 'excused').length;
    const attendanceRate =
      total > 0 ? ((present + late) / total) * 100 : 0;

    return {
      studentId,
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
    };
  }

  // ==================== إشعارات ====================
  private async handleAttendanceNotification(attendance: any) {
    try {
      if (attendance.parentNotified) return;

      if (
        attendance.status === 'absent' &&
        attendance.student?.parent?.user
      ) {
        await this.notificationsService.notifyAbsence(
          attendance.studentId,
          attendance.id,
        );
        await this.prisma.attendance.update({
          where: { id: attendance.id },
          data: { parentNotified: true, notificationSentAt: new Date() },
        });
      } else if (
        attendance.status === 'late' &&
        attendance.student?.parent?.user
      ) {
        await this.notificationsService.notifyLate(
          attendance.studentId,
          attendance.lateMinutes,
          attendance.id,
        );
        await this.prisma.attendance.update({
          where: { id: attendance.id },
          data: { parentNotified: true, notificationSentAt: new Date() },
        });
      }
    } catch (error) {
      console.error('خطأ في إرسال إشعار الحضور:', error);
    }
  }
}