import { AppLanguage } from '@prisma/client';
export type LocalizedText = {
    ar: string;
    en: string;
};
export type LocalizedNotificationContent = {
    title: LocalizedText;
    message: LocalizedText;
};
export type LocalizedBalance = {
    annualAmount: number;
    totalPaid: number;
    remaining: number;
    gradeName: string;
} | null;
export type AssessmentNotificationParams = {
    studentName: string;
    subjectName: string;
    assessmentType: string;
    assessmentTitle: string;
    maxScore: number;
    score: number;
    percentage: number;
    grade?: string | null;
    teacherName?: string;
    feedback?: string | null;
};
export type AssessmentPendingNotificationParams = {
    studentName: string;
    subjectName: string;
    assessmentType: string;
    assessmentTitle: string;
    maxScore: number;
    teacherName?: string;
};
export type AssessmentScoreUpdatedParams = {
    studentName: string;
    subjectName: string;
    assessmentType: string;
    assessmentTitle: string;
    maxScore: number;
    score: number;
    percentage: number;
    grade?: string | null;
    wasUnscored: boolean;
};
export type MonthlyReportNotificationAssessment = {
    subject: string;
    score: number | null;
    maxScore: number;
    percentage: number | null;
    grade: string | null;
};
export type MonthlyReportNotificationParams = {
    studentName: string;
    sectionName: string;
    month: number;
    year: number;
    assessments: MonthlyReportNotificationAssessment[];
    averagePercentage: number | null;
    overallGrade: string | null;
};
export declare function getMonthName(month: number, language: AppLanguage): string;
export declare function getAssessmentTypeLabel(type: string, language: AppLanguage): string;
export declare function translateGrade(grade: string | null | undefined, language: AppLanguage): string | null;
export declare function buildAbsenceNotification(studentName: string): LocalizedNotificationContent;
export declare function buildLateNotification(studentName: string, lateMinutes: number): LocalizedNotificationContent;
export declare function buildAssessmentResultNotification(params: AssessmentNotificationParams): LocalizedNotificationContent;
export declare function buildAssessmentCreatedNotification(params: AssessmentPendingNotificationParams): LocalizedNotificationContent;
export declare function buildAssessmentScoreUpdatedNotification(params: AssessmentScoreUpdatedParams): LocalizedNotificationContent;
export declare function buildNewPaymentNotification(studentName: string, amount: number, dueDate: string, balance: LocalizedBalance): LocalizedNotificationContent;
export declare function buildPaymentConfirmedNotification(studentName: string, amount: number, receiptNumber: string, balance: LocalizedBalance): LocalizedNotificationContent;
export declare function buildOverduePaymentNotification(studentName: string, amount: number, dueDate: string): LocalizedNotificationContent;
export declare function buildStudentRegisteredNotification(studentName: string, sectionInfoAr: string, sectionInfoEn?: string): LocalizedNotificationContent;
export declare function buildMonthlyReportNotification(params: MonthlyReportNotificationParams): LocalizedNotificationContent;
