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
exports.MonthlyReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let MonthlyReportService = class MonthlyReportService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async generateStudentMonthlyReport(studentId, month, year) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                parent: { include: { user: true } },
                section: { include: { grade: true } },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException('الطالب غير موجود');
        }
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const assessments = await this.prisma.assessment.findMany({
            where: {
                studentId,
                type: { in: ['midterm', 'final'] },
                assessmentDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                gradeSubject: {
                    include: {
                        subject: true,
                        teacher: true,
                    },
                },
            },
            orderBy: { assessmentDate: 'asc' },
        });
        const scoredAssessments = assessments.filter((a) => a.score !== null);
        const averagePercentage = scoredAssessments.length > 0
            ? scoredAssessments.reduce((sum, a) => sum + Number(a.percentage || 0), 0) / scoredAssessments.length
            : null;
        return {
            student: {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                section: student.section
                    ? `${student.section.grade?.name} - ${student.section.name}`
                    : 'غير محدد',
            },
            period: {
                month,
                year,
                monthName: this.getArabicMonthName(month),
            },
            assessments: assessments.map((a) => ({
                id: a.id,
                subject: a.gradeSubject?.subject?.name || 'غير محدد',
                teacher: a.gradeSubject?.teacher
                    ? `${a.gradeSubject.teacher.firstName} ${a.gradeSubject.teacher.lastName}`
                    : 'غير محدد',
                type: a.type === 'midterm' ? 'مذاكرة' : 'فحص نهائي',
                title: a.title,
                maxScore: Number(a.maxScore),
                score: a.score !== null ? Number(a.score) : null,
                percentage: a.percentage !== null ? Number(a.percentage) : null,
                grade: a.grade,
                date: a.assessmentDate,
                feedback: a.feedback,
            })),
            summary: {
                totalAssessments: assessments.length,
                scoredAssessments: scoredAssessments.length,
                averagePercentage: averagePercentage
                    ? Math.round(averagePercentage * 100) / 100
                    : null,
                overallGrade: averagePercentage
                    ? this.calculateGrade(averagePercentage)
                    : null,
            },
        };
    }
    async generateSectionMonthlyReports(sectionId, month, year) {
        const section = await this.prisma.section.findUnique({
            where: { id: sectionId },
            include: { grade: true },
        });
        if (!section) {
            throw new common_1.NotFoundException('الشعبة غير موجودة');
        }
        const students = await this.prisma.student.findMany({
            where: { sectionId, status: 'active' },
            orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
        });
        const reports = [];
        for (const student of students) {
            const report = await this.generateStudentMonthlyReport(student.id, month, year);
            reports.push(report);
        }
        return {
            section: {
                id: section.id,
                name: `${section.grade.name} - ${section.name}`,
            },
            period: {
                month,
                year,
                monthName: this.getArabicMonthName(month),
            },
            totalStudents: reports.length,
            reports,
        };
    }
    async generateAndNotifySectionReports(sectionId, month, year, generatedByUserId) {
        if (month < 1 || month > 12) {
            throw new common_1.BadRequestException('الشهر يجب أن يكون بين 1 و 12');
        }
        const sectionReports = await this.generateSectionMonthlyReports(sectionId, month, year);
        let notifiedCount = 0;
        const monthName = this.getArabicMonthName(month);
        for (const report of sectionReports.reports) {
            const student = await this.prisma.student.findUnique({
                where: { id: report.student.id },
                include: { parent: { include: { user: true } } },
            });
            if (student?.parent?.userId && report.assessments.length > 0) {
                let message = `📋 التقرير الشهري لـ ${report.student.name} - ${monthName} ${year}\n`;
                message += `📍 ${report.student.section}\n\n`;
                if (report.assessments.length > 0) {
                    message += `📝 التقييمات:\n`;
                    for (const assessment of report.assessments) {
                        const scoreText = assessment.score !== null
                            ? `${assessment.score}/${assessment.maxScore} (${assessment.percentage?.toFixed(0)}%)`
                            : 'لم يُقيَّم بعد';
                        message += `• ${assessment.subject} - ${assessment.type}: ${scoreText}`;
                        if (assessment.grade) {
                            message += ` - ${assessment.grade}`;
                        }
                        message += `\n`;
                    }
                }
                if (report.summary.averagePercentage !== null) {
                    message += `\n📊 المعدل العام: ${report.summary.averagePercentage.toFixed(1)}% - ${report.summary.overallGrade}`;
                }
                await this.notificationsService.create({
                    userId: student.parent.userId,
                    relatedId: report.student.id,
                    relatedType: 'assessment',
                    title: `تقرير شهري - ${report.student.name} - ${monthName}`,
                    message,
                    type: 'info',
                    channel: 'push',
                    data: {
                        studentId: report.student.id,
                        month,
                        year,
                    },
                });
                notifiedCount++;
            }
        }
        const savedReport = await this.prisma.report.create({
            data: {
                generatedBy: generatedByUserId,
                type: 'performance',
                title: `تقرير شهري - ${sectionReports.section.name} - ${monthName} ${year}`,
                parameters: { sectionId, month, year },
                data: sectionReports,
                format: 'json',
                periodStart: new Date(year, month - 1, 1),
                periodEnd: new Date(year, month, 0),
            },
        });
        return {
            message: `تم إنشاء التقرير الشهري وإرسال ${notifiedCount} إشعار لأولياء الأمور`,
            reportId: savedReport.id,
            totalStudents: sectionReports.totalStudents,
            notifiedParents: notifiedCount,
            section: sectionReports.section,
            period: sectionReports.period,
        };
    }
    async generateAndNotifyAllSections(month, year, generatedByUserId) {
        if (month < 1 || month > 12) {
            throw new common_1.BadRequestException('الشهر يجب أن يكون بين 1 و 12');
        }
        const sections = await this.prisma.section.findMany({
            where: { status: 'active' },
            select: { id: true, name: true, grade: { select: { name: true } } },
        });
        const results = [];
        let totalNotified = 0;
        for (const section of sections) {
            try {
                const result = await this.generateAndNotifySectionReports(section.id, month, year, generatedByUserId);
                results.push(result);
                totalNotified += result.notifiedParents;
            }
            catch (error) {
                console.error(`خطأ في إنشاء تقرير الشعبة ${section.grade.name} - ${section.name}:`, error);
                results.push({
                    section: { id: section.id, name: `${section.grade.name} - ${section.name}` },
                    error: 'فشل في إنشاء التقرير',
                });
            }
        }
        return {
            message: `تم إنشاء التقارير الشهرية لـ ${sections.length} شعبة وإرسال ${totalNotified} إشعار`,
            totalSections: sections.length,
            totalNotified,
            monthName: this.getArabicMonthName(month),
            year,
            results,
        };
    }
    getArabicMonthName(month) {
        const months = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
        ];
        return months[month - 1] || '';
    }
    calculateGrade(percentage) {
        if (percentage >= 90)
            return 'ممتاز';
        if (percentage >= 80)
            return 'جيد جداً';
        if (percentage >= 70)
            return 'جيد';
        if (percentage >= 60)
            return 'مقبول';
        if (percentage >= 50)
            return 'ضعيف';
        return 'راسب';
    }
};
exports.MonthlyReportService = MonthlyReportService;
exports.MonthlyReportService = MonthlyReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MonthlyReportService);
//# sourceMappingURL=monthly-report.service.js.map