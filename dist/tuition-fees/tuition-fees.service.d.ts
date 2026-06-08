import { PrismaService } from '../prisma/prisma.service';
import { CreateTuitionFeeDto, UpdateTuitionFeeDto } from './dto/tuition-fee.dto';
export declare class TuitionFeesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: number, userId: number, dto: CreateTuitionFeeDto): Promise<{
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
        organizationId: number;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    findAll(orgId: number, academicYear?: string): Promise<({
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
        organizationId: number;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    })[]>;
    findOne(orgId: number, id: number): Promise<{
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
        organizationId: number;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    findByGrade(orgId: number, gradeId: number, academicYear: string): Promise<{
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
        organizationId: number;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    update(orgId: number, id: number, dto: UpdateTuitionFeeDto): Promise<{
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
        organizationId: number;
        academicYear: string;
        gradeId: number;
        annualAmount: import("@prisma/client/runtime/library").Decimal;
        createdBy: number | null;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
    getStudentBalance(studentId: number, academicYear: string): Promise<{
        annualAmount: number;
        totalPaid: number;
        remaining: number;
        gradeName: string;
    } | null>;
}
