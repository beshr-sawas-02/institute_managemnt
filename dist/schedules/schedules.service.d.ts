import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
export declare class SchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: number, dto: CreateScheduleDto): Promise<{
        section: {
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
        gradeSubject: {
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
    }>;
    findAll(orgId: number): Promise<({
        section: {
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
        gradeSubject: {
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
    })[]>;
    findBySection(orgId: number, sectionId: number): Promise<({
        gradeSubject: {
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
    })[]>;
    findByTeacher(orgId: number, teacherId: number): Promise<({
        section: {
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
        gradeSubject: {
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
    })[]>;
    findOne(orgId: number, id: number): Promise<{
        section: {
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
        gradeSubject: {
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
    }>;
    update(orgId: number, id: number, dto: UpdateScheduleDto): Promise<{
        section: {
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
        gradeSubject: {
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
    }>;
    private validateRelations;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
