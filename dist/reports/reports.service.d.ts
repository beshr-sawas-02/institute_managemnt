import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/report.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    private generateAttendanceReport;
    private generateFinancialReport;
    private generatePerformanceReport;
    private generateComparisonReport;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<{
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
