import { PrismaService } from '../prisma/prisma.service';
import { CreateGradeDto, UpdateGradeDto } from './dto/grade.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class GradesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: number, createGradeDto: CreateGradeDto): Promise<{
        name: string;
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        sections: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            status: import(".prisma/client").$Enums.SectionStatus;
            academicYear: string;
            gradeId: number;
            maxStudents: number | null;
        }[];
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
            subject: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
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
        level: import(".prisma/client").$Enums.GradeLevel;
    }>>;
    findOne(orgId: number, id: number): Promise<{
        sections: ({
            students: {
                id: number;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                userId: number | null;
                firstName: string;
                lastName: string;
                status: import(".prisma/client").$Enums.StudentStatus;
                parentId: number | null;
                sectionId: number | null;
                dateOfBirth: Date;
                gender: import(".prisma/client").$Enums.Gender;
                academicYear: string | null;
                registrationDate: Date;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            status: import(".prisma/client").$Enums.SectionStatus;
            academicYear: string;
            gradeId: number;
            maxStudents: number | null;
        })[];
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
            subject: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
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
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    update(orgId: number, id: number, updateGradeDto: UpdateGradeDto): Promise<{
        name: string;
        description: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
