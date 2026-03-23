import { ReportsService } from './reports.service';
import { MonthlyReportService } from './monthly-report.service';
import { CreateReportDto } from './dto/report.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ReportsController {
    private readonly service;
    private readonly monthlyReportService;
    constructor(service: ReportsService, monthlyReportService: MonthlyReportService);
    create(userId: number, dto: CreateReportDto): Promise<{
        generator: {
            email: string;
            id: number;
        } | null;
    } & {
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        filePath: string | null;
        generatedAt: Date;
        generatedBy: number | null;
    }>;
    getStudentMonthlyReport(studentId: number, month: number, year: number): Promise<import("./monthly-report.service").StudentMonthlyReport>;
    getSectionMonthlyReport(sectionId: number, month: number, year: number): Promise<{
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
    generateAndNotifySectionReports(sectionId: number, month: number, year: number, userId: number): Promise<import("./monthly-report.service").SectionNotifyResult>;
    generateAndNotifyAllSections(month: number, year: number, userId: number): Promise<{
        message: string;
        totalSections: number;
        totalNotified: number;
        monthName: string;
        year: number;
        results: (import("./monthly-report.service").SectionNotifyResult | import("./monthly-report.service").SectionNotifyError)[];
    }>;
    findAll(p: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        generator: {
            email: string;
            id: number;
        } | null;
    } & {
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        filePath: string | null;
        generatedAt: Date;
        generatedBy: number | null;
    }>>;
    findOne(id: number): Promise<{
        generator: {
            email: string;
            id: number;
        } | null;
    } & {
        type: import(".prisma/client").$Enums.ReportType;
        format: import(".prisma/client").$Enums.ReportFormat;
        title: string;
        id: number;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        parameters: import("@prisma/client/runtime/library").JsonValue | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        filePath: string | null;
        generatedAt: Date;
        generatedBy: number | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
