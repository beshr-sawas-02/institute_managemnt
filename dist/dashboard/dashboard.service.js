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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const offset = 3 * 60 * 60 * 1000;
        const nowLocal = new Date(Date.now() + offset);
        const todayStr = nowLocal.toISOString().slice(0, 10);
        const today = new Date(`${todayStr}T00:00:00.000Z`);
        const tomorrow = new Date(`${todayStr}T00:00:00.000Z`);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        const [totalStudents, activeStudents, totalTeachers, activeTeachers, totalParents, totalSections, todayPresent, todayAbsent, todayLate, todayExcused, totalPaidPayments, totalPendingPayments, totalPartialPayments, totalExpenses, totalAssessments, avgPercentage, unreadNotifications,] = await Promise.all([
            this.prisma.student.count(),
            this.prisma.student.count({ where: { status: 'active' } }),
            this.prisma.teacher.count(),
            this.prisma.teacher.count({ where: { status: 'active' } }),
            this.prisma.parent.count(),
            this.prisma.section.count({ where: { status: 'active' } }),
            this.prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: 'present' } }),
            this.prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: 'absent' } }),
            this.prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: 'late' } }),
            this.prisma.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: 'excused' } }),
            this.prisma.payment.aggregate({ where: { status: 'paid' }, _sum: { finalAmount: true } }),
            this.prisma.payment.aggregate({ where: { status: 'pending' }, _sum: { finalAmount: true } }),
            this.prisma.payment.aggregate({ where: { status: 'partial' }, _sum: { finalAmount: true } }),
            this.prisma.expense.aggregate({ _sum: { amount: true } }),
            this.prisma.assessment.count(),
            this.prisma.assessment.aggregate({ _avg: { percentage: true } }),
            this.prisma.notification.count({ where: { isRead: false } }),
        ]);
        const totalPaid = Number(totalPaidPayments._sum.finalAmount) || 0;
        const totalExp = Number(totalExpenses._sum.amount) || 0;
        const studentsByGrade = await this.prisma.grade.findMany({
            include: {
                sections: {
                    include: {
                        _count: { select: { students: true } },
                    },
                    where: { status: 'active' },
                },
            },
        });
        const gradeDistribution = studentsByGrade.map((grade) => ({
            gradeName: grade.name,
            studentCount: grade.sections.reduce((sum, s) => sum + s._count.students, 0),
        }));
        const recentPayments = await this.prisma.payment.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                student: { select: { firstName: true, lastName: true } },
            },
        });
        const recentAbsences = await this.prisma.attendance.findMany({
            take: 5,
            where: { status: 'absent' },
            orderBy: { date: 'desc' },
            include: {
                student: { select: { firstName: true, lastName: true } },
            },
        });
        const gradeStats = await this.prisma.assessment.groupBy({
            by: ['grade'],
            _count: true,
        });
        return {
            overview: {
                students: { total: totalStudents, active: activeStudents },
                teachers: { total: totalTeachers, active: activeTeachers },
                parents: totalParents,
                sections: totalSections,
            },
            todayAttendance: {
                present: todayPresent,
                absent: todayAbsent,
                late: todayLate,
                excused: todayExcused,
                total: todayPresent + todayAbsent + todayLate + todayExcused,
            },
            financial: {
                totalPaid,
                totalPending: Number(totalPendingPayments._sum.finalAmount) || 0,
                totalPartial: Number(totalPartialPayments._sum.finalAmount) || 0,
                totalExpenses: totalExp,
                netBalance: totalPaid - totalExp,
                budgetUsedPercentage: totalPaid > 0 ? ((totalExp / totalPaid) * 100).toFixed(2) : '0',
            },
            assessments: {
                total: totalAssessments,
                averagePercentage: Number(avgPercentage._avg.percentage)?.toFixed(2) || '0',
                gradeDistribution: gradeStats,
            },
            notifications: {
                unread: unreadNotifications,
            },
            gradeDistribution,
            recentPayments,
            recentAbsences,
        };
    }
    async getFinancialSummary(month, year) {
        const targetYear = year || new Date().getFullYear();
        const targetMonth = month || new Date().getMonth() + 1;
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);
        const [monthlyPayments, monthlyExpenses] = await Promise.all([
            this.prisma.payment.aggregate({
                where: {
                    status: 'paid',
                    paymentDate: { gte: startDate, lte: endDate },
                },
                _sum: { finalAmount: true },
            }),
            this.prisma.expense.aggregate({
                where: {
                    expenseDate: { gte: startDate, lte: endDate },
                },
                _sum: { amount: true },
            }),
        ]);
        const expensesByCategory = await this.prisma.expense.groupBy({
            by: ['category'],
            where: { expenseDate: { gte: startDate, lte: endDate } },
            _sum: { amount: true },
        });
        return {
            month: targetMonth,
            year: targetYear,
            income: Number(monthlyPayments._sum.finalAmount) || 0,
            expenses: Number(monthlyExpenses._sum.amount) || 0,
            net: (Number(monthlyPayments._sum.finalAmount) || 0) -
                (Number(monthlyExpenses._sum.amount) || 0),
            expensesByCategory,
        };
    }
    async getAttendanceSummary(dateFrom, dateTo) {
        const where = {};
        if (dateFrom)
            where.date = { gte: new Date(dateFrom) };
        if (dateTo)
            where.date = { ...where.date, lte: new Date(dateTo) };
        const [total, present, absent, late, excused] = await Promise.all([
            this.prisma.attendance.count({ where }),
            this.prisma.attendance.count({ where: { ...where, status: 'present' } }),
            this.prisma.attendance.count({ where: { ...where, status: 'absent' } }),
            this.prisma.attendance.count({ where: { ...where, status: 'late' } }),
            this.prisma.attendance.count({ where: { ...where, status: 'excused' } }),
        ]);
        const topAbsentees = await this.prisma.attendance.groupBy({
            by: ['studentId'],
            where: { ...where, status: 'absent' },
            _count: { studentId: true },
            orderBy: { _count: { studentId: 'desc' } },
            take: 10,
        });
        const studentIds = topAbsentees.map((a) => a.studentId);
        const students = await this.prisma.student.findMany({
            where: { id: { in: studentIds } },
            select: { id: true, firstName: true, lastName: true },
        });
        const absenteesWithNames = topAbsentees.map((a) => ({
            ...a,
            student: students.find((s) => s.id === a.studentId),
        }));
        return {
            total,
            present,
            absent,
            late,
            excused,
            attendanceRate: total > 0 ? (((present + late) / total) * 100).toFixed(2) : '0',
            topAbsentees: absenteesWithNames,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map