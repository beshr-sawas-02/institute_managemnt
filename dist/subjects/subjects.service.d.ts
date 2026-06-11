import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class SubjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: number, dto: CreateSubjectDto): Promise<{
        name: string;
        description: string | null;
        id: number;
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        gradeSubjects: ({
            teacher: {
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.TeacherStatus;
                userId: number | null;
                firstName: string;
                lastName: string;
                specialization: string;
                qualifications: string | null;
                experienceYears: number | null;
                bio: string | null;
                salary: import("@prisma/client/runtime/library").Decimal | null;
                hireDate: Date | null;
            };
            grade: {
                name: string;
                description: string | null;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            sectionId: number | null;
            gradeId: number;
            subjectId: number;
            teacherId: number;
        })[];
    } & {
        name: string;
        description: string | null;
        id: number;
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findOne(orgId: number, id: number): Promise<{
        gradeSubjects: ({
            teacher: {
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.TeacherStatus;
                userId: number | null;
                firstName: string;
                lastName: string;
                specialization: string;
                qualifications: string | null;
                experienceYears: number | null;
                bio: string | null;
                salary: import("@prisma/client/runtime/library").Decimal | null;
                hireDate: Date | null;
            };
            grade: {
                name: string;
                description: string | null;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            sectionId: number | null;
            gradeId: number;
            subjectId: number;
            teacherId: number;
        })[];
    } & {
        name: string;
        description: string | null;
        id: number;
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(orgId: number, id: number, dto: UpdateSubjectDto): Promise<{
        name: string;
        description: string | null;
        id: number;
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
