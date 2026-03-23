import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export interface StudentReportAssessment {
    id: number;
    subject: string;
    teacher: string;
    type: string;
    title: string;
    maxScore: number;
    score: number | null;
    percentage: number | null;
    grade: string | null;
    date: Date;
    feedback: string | null;
}
export interface StudentReportSummary {
    totalAssessments: number;
    scoredAssessments: number;
    averagePercentage: number | null;
    overallGrade: string | null;
}
export interface StudentMonthlyReport {
    student: {
        id: number;
        name: string;
        section: string;
    };
    period: {
        month: number;
        year: number;
        monthName: string;
    };
    assessments: StudentReportAssessment[];
    summary: StudentReportSummary;
}
export interface SectionNotifyResult {
    message: string;
    reportId: number;
    totalStudents: number;
    notifiedParents: number;
    section: {
        id: number;
        name: string;
    };
    period: {
        month: number;
        year: number;
        monthName: string;
    };
}
export interface SectionNotifyError {
    section: {
        id: number;
        name: string;
    };
    error: string;
}
export declare class MonthlyReportService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    generateStudentMonthlyReport(studentId: number, month: number, year: number): Promise<StudentMonthlyReport>;
    generateSectionMonthlyReports(sectionId: number, month: number, year: number): Promise<{
        section: {
            id: number;
            name: string;
        };
        period: {
            month: number;
            year: number;
            monthName: string;
        };
        totalStudents: number;
        reports: StudentMonthlyReport[];
    }>;
    generateAndNotifySectionReports(sectionId: number, month: number, year: number, generatedByUserId: number): Promise<SectionNotifyResult>;
    generateAndNotifyAllSections(month: number, year: number, generatedByUserId: number): Promise<{
        message: string;
        totalSections: number;
        totalNotified: number;
        monthName: string;
        year: number;
        results: (SectionNotifyResult | SectionNotifyError)[];
    }>;
    private getArabicMonthName;
    private calculateGrade;
}
