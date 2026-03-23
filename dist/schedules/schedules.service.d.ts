import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';
export declare class SchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateScheduleDto): Promise<{
        section: {
            grade: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
        } & {
            name: string;
            id: number;
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
    findAll(): Promise<({
        section: {
            grade: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
        } & {
            name: string;
            id: number;
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
    findBySection(sectionId: number): Promise<({
        gradeSubject: {
            teacher: {
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
    findByTeacher(teacherId: number): Promise<({
        section: {
            grade: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SectionStatus;
            academicYear: string;
            gradeId: number;
            maxStudents: number | null;
        };
        gradeSubject: {
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
    findOne(id: number): Promise<{
        section: {
            grade: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
        } & {
            name: string;
            id: number;
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
    update(id: number, dto: UpdateScheduleDto): Promise<{
        section: {
            grade: {
                description: string | null;
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
        } & {
            name: string;
            id: number;
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
    remove(id: number): Promise<{
        message: string;
    }>;
}
