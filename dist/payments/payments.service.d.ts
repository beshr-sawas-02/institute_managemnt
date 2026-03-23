import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TuitionFeesService } from '../tuition-fees/tuition-fees.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class PaymentsService {
    private prisma;
    private notificationsService;
    private tuitionFeesService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService, tuitionFeesService: TuitionFeesService);
    create(dto: CreatePaymentDto): Promise<{
        student: {
            parent: ({
                user: {
                    email: string;
                    password: string;
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        academicYear: string;
        dueDate: Date;
        studentId: number;
        notes: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<{
        student: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        academicYear: string;
        dueDate: Date;
        studentId: number;
        notes: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>>;
    findByStudent(studentId: number, academicYear?: string): Promise<{
        payments: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            academicYear: string;
            dueDate: Date;
            studentId: number;
            notes: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            finalAmount: import("@prisma/client/runtime/library").Decimal | null;
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
    getStats(academicYear?: string): Promise<{
        totalPaid: number | import("@prisma/client/runtime/library").Decimal;
        totalPending: number | import("@prisma/client/runtime/library").Decimal;
        totalPartial: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    findOne(id: number): Promise<{
        student: {
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        academicYear: string;
        dueDate: Date;
        studentId: number;
        notes: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>;
    update(id: number, dto: UpdatePaymentDto): Promise<{
        student: {
            parent: ({
                user: {
                    email: string;
                    password: string;
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
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        academicYear: string;
        dueDate: Date;
        studentId: number;
        notes: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal | null;
        paymentDate: Date | null;
        receiptNumber: string | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
