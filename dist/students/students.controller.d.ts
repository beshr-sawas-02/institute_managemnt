import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        parent: {
            id: number;
            firstName: string;
            lastName: string;
        } | null;
        section: ({
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
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
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
    }>>;
    findBySection(sectionId: number): Promise<({
        parent: {
            phone: string;
            id: number;
            firstName: string;
            lastName: string;
        } | null;
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
    })[]>;
    findByParent(parentId: number): Promise<({
        section: ({
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
    })[]>;
    findOne(id: number): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
        parent: {
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
        } | null;
        section: ({
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
        }) | null;
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
        assessments: ({
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
            feedback: string | null;
            percentage: import("@prisma/client/runtime/library").Decimal | null;
        })[];
        payments: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
    }>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<{
        parent: {
            id: number;
            firstName: string;
            lastName: string;
        } | null;
        section: ({
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
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
