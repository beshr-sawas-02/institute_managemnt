import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTeacherDto: CreateTeacherDto): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<{
        user: {
            email: string;
            id: number;
        } | null;
        gradeSubjects: ({
            grade: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
            subject: {
                description: string | null;
                name: string;
                id: number;
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
        createdAt: Date;
        updatedAt: Date;
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
    }>>;
    findOne(id: number): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
        gradeSubjects: ({
            grade: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
            subject: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
            };
            schedules: ({
                section: {
                    name: string;
                    id: number;
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
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
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
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
