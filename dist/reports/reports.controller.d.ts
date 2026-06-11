import { ReportsService } from './reports.service';
import { MonthlyReportService } from './monthly-report.service';
import { CreateReportDto } from './dto/report.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ReportsController {
    private readonly service;
    private readonly monthlyReportService;
    constructor(service: ReportsService, monthlyReportService: MonthlyReportService);
    create(orgId: number, userId: number, dto: CreateReportDto): Promise<{
        generator: {
            email: string;
            id: number;
        } | null;
    } & {
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        title: string;
        id: number;
        organizationId: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        filePath: string | null;
        generatedAt: Date;
        generatedBy: number | null;
    }>;
    getStudentMonthlyReport(orgId: number, studentId: number, month: number, year: number): Promise<import("./monthly-report.service").StudentMonthlyReport>;
    getSectionMonthlyReport(orgId: number, sectionId: number, month: number, year: number): Promise<{
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
        reports: import("./monthly-report.service").StudentMonthlyReport[];
    }>;
    generateAndNotifySectionReports(orgId: number, userId: number, sectionId: number, month: number, year: number): Promise<import("./monthly-report.service").SectionNotifyResult>;
    generateAndNotifyAllSections(orgId: number, userId: number, month: number, year: number): Promise<{
        message: string;
        totalSections: number;
        totalNotified: number;
        monthName: string;
        year: number;
        results: (import("./monthly-report.service").SectionNotifyResult | import("./monthly-report.service").SectionNotifyError)[];
    }>;
    findAll(orgId: number, p: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        generator: {
            email: string;
            id: number;
        } | null;
    } & {
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        title: string;
        id: number;
        organizationId: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        filePath: string | null;
        generatedAt: Date;
        generatedBy: number | null;
    }>>;
    findOne(orgId: number, id: number): Promise<{
        generator: {
            email: string;
            id: number;
        } | null;
    } & {
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        title: string;
        id: number;
        organizationId: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        filePath: string | null;
        generatedAt: Date;
        generatedBy: number | null;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
