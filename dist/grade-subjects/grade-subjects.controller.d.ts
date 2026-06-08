import { GradeSubjectsService } from './grade-subjects.service';
import { CreateGradeSubjectDto, UpdateGradeSubjectDto } from './dto/grade-subject.dto';
export declare class GradeSubjectsController {
    private readonly service;
    constructor(service: GradeSubjectsService);
    create(orgId: number, dto: CreateGradeSubjectDto): Promise<{
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
    }>;
    findAll(orgId: number): Promise<({
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
    })[]>;
    findByGrade(orgId: number, gradeId: number): Promise<({
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
    })[]>;
    findByTeacher(orgId: number, teacherId: number): Promise<({
        grade: {
            name: string;
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            level: import(".prisma/client").$Enums.GradeLevel;
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
    })[]>;
    findOne(orgId: number, id: number): Promise<{
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
        subject: {
            name: string;
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
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
    update(orgId: number, id: number, dto: UpdateGradeSubjectDto): Promise<{
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
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
