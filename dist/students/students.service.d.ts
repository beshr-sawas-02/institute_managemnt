import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class StudentsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(orgId: number, createStudentDto: CreateStudentDto): Promise<{
        parent: {
            id: number;
            firstName: string;
            lastName: string;
        } | null;
        section: ({
            grade: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
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
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        user: {
            email: string;
            id: number;
        } | null;
        parent: {
            phone: string;
            id: number;
            firstName: string;
            lastName: string;
        } | null;
        section: ({
            grade: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
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
    }>>;
    findOne(orgId: number, id: number): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
        parent: {
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
        } | null;
        section: ({
            grade: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
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
        }) | null;
        payments: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            academicYear: string;
            dueDate: Date;
            studentId: number;
            notes: string | null;
            finalAmount: import("@prisma/client/runtime/library").Decimal | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            paymentDate: Date | null;
            receiptNumber: string | null;
        }[];
        assessments: ({
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
        })[];
        attendances: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            date: Date;
            studentId: number;
            lateMinutes: number;
            notes: string | null;
            parentNotified: boolean;
            notificationSentAt: Date | null;
        }[];
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
    }>;
    findBySection(orgId: number, sectionId: number): Promise<({
        parent: {
            phone: string;
            id: number;
            firstName: string;
            lastName: string;
        } | null;
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
    })[]>;
    findByParent(orgId: number, parentId: number): Promise<({
        section: ({
            grade: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
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
    })[]>;
    update(orgId: number, id: number, updateStudentDto: UpdateStudentDto): Promise<{
        parent: {
            id: number;
            firstName: string;
            lastName: string;
        } | null;
        section: ({
            grade: {
                name: string;
                description: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                level: import(".prisma/client").$Enums.GradeLevel;
            };
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
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
