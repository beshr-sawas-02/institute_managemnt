import { TuitionFeesService } from './tuition-fees.service';
import { CreateTuitionFeeDto, UpdateTuitionFeeDto } from './dto/tuition-fee.dto';
export declare class TuitionFeesController {
    private readonly service;
    constructor(service: TuitionFeesService);
    create(userId: number, dto: CreateTuitionFeeDto): Promise<{
        grade: {
            name: string;
            id: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    findAll(academicYear?: string): Promise<({
        grade: {
            name: string;
            id: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    })[]>;
    findByGrade(gradeId: number, academicYear: string): Promise<{
        grade: {
            name: string;
            id: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
    } & {
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    getStudentBalance(studentId: number, academicYear: string): Promise<{
        annualAmount: number;
        totalPaid: number;
        remaining: number;
        gradeName: string;
    } | null>;
    findOne(id: number): Promise<{
        grade: {
            name: string;
            id: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    update(id: number, dto: UpdateTuitionFeeDto): Promise<{
        grade: {
            name: string;
            id: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
    } & {
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
