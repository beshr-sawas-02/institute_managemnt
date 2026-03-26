import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto, UpdateAssessmentDto } from './dto/assessment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class AssessmentsController {
    private readonly service;
    constructor(service: AssessmentsService);
    create(dto: CreateAssessmentDto): Promise<{
        student: {
            parent: ({
                user: {
                    email: string;
                    password: string;
                    preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
                    phone: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    id: number;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            } & {
                email: string | null;
                phone: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                firstName: string;
                lastName: string;
                address: string | null;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            parentId: number | null;
            sectionId: number | null;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            academicYear: string | null;
            registrationDate: Date;
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
        grade: string | null;
        type: import(".prisma/client").$Enums.AssessmentType;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        gradeSubjectId: number;
        assessmentDate: Date;
        studentId: number;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        score: import("@prisma/client/runtime/library").Decimal | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
        feedback: string | null;
    }>;
    findAll(p: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        student: {
            id: number;
            firstName: string;
            lastName: string;
        };
        gradeSubject: {
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
        };
    } & {
        grade: string | null;
        type: import(".prisma/client").$Enums.AssessmentType;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        gradeSubjectId: number;
        assessmentDate: Date;
        studentId: number;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        score: import("@prisma/client/runtime/library").Decimal | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
        feedback: string | null;
    }>>;
    findByStudent(id: number): Promise<({
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
        grade: string | null;
        type: import(".prisma/client").$Enums.AssessmentType;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        gradeSubjectId: number;
        assessmentDate: Date;
        studentId: number;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        score: import("@prisma/client/runtime/library").Decimal | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
        feedback: string | null;
    })[]>;
    findOne(id: number): Promise<{
        student: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            parentId: number | null;
            sectionId: number | null;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            academicYear: string | null;
            registrationDate: Date;
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
        };
    } & {
        grade: string | null;
        type: import(".prisma/client").$Enums.AssessmentType;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        gradeSubjectId: number;
        assessmentDate: Date;
        studentId: number;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        score: import("@prisma/client/runtime/library").Decimal | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
        feedback: string | null;
    }>;
    update(id: number, dto: UpdateAssessmentDto): Promise<{
        student: {
            parent: ({
                user: {
                    email: string;
                    password: string;
                    preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
                    phone: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    id: number;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            } & {
                email: string | null;
                phone: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                firstName: string;
                lastName: string;
                address: string | null;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            parentId: number | null;
            sectionId: number | null;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            academicYear: string | null;
            registrationDate: Date;
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
        grade: string | null;
        type: import(".prisma/client").$Enums.AssessmentType;
        title: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        gradeSubjectId: number;
        assessmentDate: Date;
        studentId: number;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        score: import("@prisma/client/runtime/library").Decimal | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
        feedback: string | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
