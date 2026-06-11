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
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        sections: {
            name: string;
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SectionStatus;
            academicYear: string;
            gradeId: number;
            maxStudents: number | null;
        }[];
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
            subject: {
                name: string;
                description: string | null;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
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
        level: import(".prisma/client").$Enums.GradeLevel;
    }>>;
    findOne(orgId: number, id: number): Promise<{
        sections: ({
            students: {
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.StudentStatus;
                address: string | null;
                userId: number | null;
                firstName: string;
                lastName: string;
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
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SectionStatus;
            academicYear: string;
            gradeId: number;
            maxStudents: number | null;
        })[];
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
            subject: {
                name: string;
                description: string | null;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
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
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    update(orgId: number, id: number, updateGradeDto: UpdateGradeDto): Promise<{
        name: string;
        description: string | null;
        id: number;
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
