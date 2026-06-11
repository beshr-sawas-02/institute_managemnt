import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: number, createTeacherDto: CreateTeacherDto): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
    } & {
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
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        user: {
            email: string;
            id: number;
        } | null;
        gradeSubjects: ({
            grade: {
                name: string;
                description: string | null;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
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
    }>>;
    findOne(orgId: number, id: number): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
        gradeSubjects: ({
            grade: {
                name: string;
                description: string | null;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
            subject: {
                name: string;
                description: string | null;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
            };
            schedules: ({
                section: {
                    name: string;
                    id: number;
                    organizationId: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: import(".prisma/client").$Enums.SectionStatus;
                    academicYear: string;
                    gradeId: number;
                    maxStudents: number | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.ScheduleStatus;
                sectionId: number;
                gradeSubjectId: number;
                dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
                startTime: Date;
                endTime: Date;
                room: string | null;
            })[];
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
    }>;
    update(orgId: number, id: number, updateTeacherDto: UpdateTeacherDto): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
    } & {
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
    }>;
    private ensureUserBelongsToOrg;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
