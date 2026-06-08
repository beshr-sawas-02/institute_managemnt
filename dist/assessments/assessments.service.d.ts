import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAssessmentDto, UpdateAssessmentDto } from './dto/assessment.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class AssessmentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(orgId: number, dto: CreateAssessmentDto): Promise<{
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
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: number;
                    lastLogin: Date | null;
                } | null;
            } & {
                email: string | null;
                phone: string;
                id: number;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                userId: number | null;
                firstName: string;
                lastName: string;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
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
        };
        gradeSubject: {
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
        feedback: string | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        student: {
            id: number;
            firstName: string;
            lastName: string;
        };
        gradeSubject: {
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
        feedback: string | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
    }>>;
    findByStudent(orgId: number, studentId: number): Promise<({
        gradeSubject: {
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
        feedback: string | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    findOne(orgId: number, id: number): Promise<{
        student: {
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
        };
        gradeSubject: {
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
        feedback: string | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    update(orgId: number, id: number, dto: UpdateAssessmentDto): Promise<{
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
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: number;
                    lastLogin: Date | null;
                } | null;
            } & {
                email: string | null;
                phone: string;
                id: number;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                userId: number | null;
                firstName: string;
                lastName: string;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
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
        };
        gradeSubject: {
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
        feedback: string | null;
        percentage: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
    private calculateGrade;
}
