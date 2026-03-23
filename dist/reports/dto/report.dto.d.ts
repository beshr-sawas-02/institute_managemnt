import { ReportType, ReportFormat } from '@prisma/client';
export declare class CreateReportDto {
    type: ReportType;
    title: string;
    parameters?: Record<string, any>;
    format?: ReportFormat;
    periodStart?: string;
    periodEnd?: string;
}
