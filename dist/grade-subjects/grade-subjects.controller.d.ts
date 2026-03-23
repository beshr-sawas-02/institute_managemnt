import { GradeSubjectsService } from './grade-subjects.service';
import { CreateGradeSubjectDto, UpdateGradeSubjectDto } from './dto/grade-subject.dto';
export declare class GradeSubjectsController {
    private readonly service;
    constructor(service: GradeSubjectsService);
    create(dto: CreateGradeSubjectDto): Promise<{
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
    }>;
    findAll(): Promise<({
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
    })[]>;
    findByGrade(gradeId: number): Promise<({
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
    })[]>;
    findByTeacher(teacherId: number): Promise<({
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
    })[]>;
    findOne(id: number): Promise<{
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
        schedules: {
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
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        sectionId: number | null;
        gradeId: number;
        subjectId: number;
        teacherId: number;
    }>;
    update(id: number, dto: UpdateGradeSubjectDto): Promise<{
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
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
