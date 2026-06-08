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
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        gradeSubjects: ({
            teacher: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                userId: number | null;
                firstName: string;
                lastName: string;
                specialization: string;
                qualifications: string | null;
                experienceYears: number | null;
                bio: string | null;
                salary: import("@prisma/client/runtime/library").Decimal | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                hireDate: Date | null;
            };
            grade: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
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
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
    }>>;
    findOne(orgId: number, id: number): Promise<{
        gradeSubjects: ({
            teacher: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                userId: number | null;
                firstName: string;
                lastName: string;
                specialization: string;
                qualifications: string | null;
                experienceYears: number | null;
                bio: string | null;
                salary: import("@prisma/client/runtime/library").Decimal | null;
                status: import(".prisma/client").$Enums.TeacherStatus;
                hireDate: Date | null;
            };
            grade: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
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
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
    }>;
    update(orgId: number, id: number, dto: UpdateSubjectDto): Promise<{
        name: string;
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
