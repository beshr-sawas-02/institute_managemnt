import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableBalance(orgId: number): Promise<number>;
    create(orgId: number, userId: number, dto: CreateExpenseDto): Promise<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        createdBy: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        createdBy: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>>;
    getStats(orgId: number, dateFrom?: string, dateTo?: string): Promise<{
        total: number | import("@prisma/client/runtime/library").Decimal;
        byCategory: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ExpenseGroupByOutputType, "category"[]> & {
            _count: number;
            _sum: {
                amount: import("@prisma/client/runtime/library").Decimal | null;
            };
        })[];
        availableBalance: number;
    }>;
    findOne(orgId: number, id: number): Promise<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        createdBy: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>;
    update(orgId: number, id: number, dto: UpdateExpenseDto): Promise<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        createdBy: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
