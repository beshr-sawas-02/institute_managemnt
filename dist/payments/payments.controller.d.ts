import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PaymentsController {
    private readonly service;
    constructor(service: PaymentsService);
    create(orgId: number, dto: CreatePaymentDto): Promise<{
        student: {
            parent: ({
                user: {
                    email: string;
                    password: string;
                    preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
                    phone: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    id: number;
                    organizationId: number;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            } & {
                email: string | null;
                phone: string;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                userId: number | null;
                firstName: string;
                lastName: string;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            userId: number | null;
            firstName: string;
            lastName: string;
            parentId: number | null;
            sectionId: number | null;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            academicYear: string | null;
            registrationDate: Date;
        };
    } & {
        id: number;
        organizationId: number;
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
        currency: string;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>;
    findAll(orgId: number, p: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        student: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        organizationId: number;
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
        currency: string;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>>;
    getStats(orgId: number, academicYear?: string): Promise<{
        totalPaid: number | import("@prisma/client/runtime/library").Decimal;
        totalPending: number | import("@prisma/client/runtime/library").Decimal;
        totalPartial: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    findByStudent(orgId: number, id: number, academicYear?: string): Promise<{
        payments: {
            id: number;
            organizationId: number;
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
            currency: string;
            paymentDate: Date | null;
            receiptNumber: string | null;
        }[];
        balance: {
            annualAmount: number;
            totalPaid: number;
            remaining: number;
            gradeName: string;
        } | null;
    }>;
    findOne(orgId: number, id: number): Promise<{
        student: {
            parent: {
                email: string | null;
                phone: string;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                userId: number | null;
                firstName: string;
                lastName: string;
                relationship: import(".prisma/client").$Enums.Relationship;
            } | null;
        } & {
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            userId: number | null;
            firstName: string;
            lastName: string;
            parentId: number | null;
            sectionId: number | null;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            academicYear: string | null;
            registrationDate: Date;
        };
    } & {
        id: number;
        organizationId: number;
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
        currency: string;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>;
    update(orgId: number, id: number, dto: UpdatePaymentDto): Promise<{
        student: {
            parent: ({
                user: {
                    email: string;
                    password: string;
                    preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
                    phone: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    id: number;
                    organizationId: number;
                    isActive: boolean;
                    lastLogin: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
            } & {
                email: string | null;
                phone: string;
                id: number;
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                userId: number | null;
                firstName: string;
                lastName: string;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            userId: number | null;
            firstName: string;
            lastName: string;
            parentId: number | null;
            sectionId: number | null;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            academicYear: string | null;
            registrationDate: Date;
        };
    } & {
        id: number;
        organizationId: number;
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
        currency: string;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
