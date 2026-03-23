"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let AttendanceService = class AttendanceService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(dto) {
        const existing = await this.prisma.attendance.findUnique({
            where: {
                unique_attendance: {
                    studentId: dto.studentId,
                    date: new Date(dto.date),
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('تم تسجيل حضور هذا الطالب لهذا اليوم مسبقاً');
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
        await this.handleAttendanceNotification(attendance);
        return attendance;
    }
    async bulkCreate(dto) {
        const results = [];
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
            await this.handleAttendanceNotification(attendance);
            results.push(attendance);
        }
        return {
            message: `تم تسجيل حضور ${results.length} طالب بنجاح`,
            data: results,
        };
    }
    async getSectionAttendanceSheet(sectionId, date) {
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
            throw new common_1.NotFoundException('لا يوجد طلاب في هذه الشعبة');
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
    async smartBulkCreate(dto) {
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
            throw new common_1.NotFoundException('لا يوجد طلاب في هذه الشعبة');
        }
        const exceptionsMap = new Map((dto.exceptions || []).map((e) => [e.studentId, e]));
        const results = [];
        for (const student of students) {
            const exception = exceptionsMap.get(student.id);
            const attendanceData = {
                studentId: student.id,
                date: new Date(dto.date),
                status: exception ? exception.status : 'present',
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
            await this.handleAttendanceNotification(attendance);
            results.push({
                order: results.length + 1,
                studentId: student.id,
                name: `${student.firstName} ${student.lastName}`,
                status: attendance.status,
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
    async findAll(filters) {
        const where = {};
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
    async findByStudent(studentId, dateFrom, dateTo) {
        const where = { studentId };
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom)
                where.date.gte = new Date(dateFrom);
            if (dateTo)
                where.date.lte = new Date(dateTo);
        }
        return this.prisma.attendance.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    }
    async findBySection(sectionId, date) {
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
    async findOne(id) {
        const attendance = await this.prisma.attendance.findUnique({
            where: { id },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        if (!attendance)
            throw new common_1.NotFoundException('سجل الحضور غير موجود');
        return attendance;
    }
    async update(id, dto) {
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
    async remove(id) {
        await this.findOne(id);
        await this.prisma.attendance.delete({ where: { id } });
        return { message: 'تم حذف سجل الحضور بنجاح' };
    }
    async getStats(studentId, dateFrom, dateTo) {
        const where = { studentId };
        if (dateFrom || dateTo) {
            where.date = {};
            if (dateFrom)
                where.date.gte = new Date(dateFrom);
            if (dateTo)
                where.date.lte = new Date(dateTo);
        }
        const records = await this.prisma.attendance.findMany({ where });
        const total = records.length;
        const present = records.filter((r) => r.status === 'present').length;
        const absent = records.filter((r) => r.status === 'absent').length;
        const late = records.filter((r) => r.status === 'late').length;
        const excused = records.filter((r) => r.status === 'excused').length;
        const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0;
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
    async handleAttendanceNotification(attendance) {
        try {
            if (attendance.parentNotified)
                return;
            if (attendance.status === 'absent' &&
                attendance.student?.parent?.user) {
                await this.notificationsService.notifyAbsence(attendance.studentId, attendance.id);
                await this.prisma.attendance.update({
                    where: { id: attendance.id },
                    data: { parentNotified: true, notificationSentAt: new Date() },
                });
            }
            else if (attendance.status === 'late' &&
                attendance.student?.parent?.user) {
                await this.notificationsService.notifyLate(attendance.studentId, attendance.lateMinutes, attendance.id);
                await this.prisma.attendance.update({
                    where: { id: attendance.id },
                    data: { parentNotified: true, notificationSentAt: new Date() },
                });
            }
        }
        catch (error) {
            console.error('خطأ في إرسال إشعار الحضور:', error);
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map