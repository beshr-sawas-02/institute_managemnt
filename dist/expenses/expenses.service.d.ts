import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    getAvailableBalance(): Promise<number>;
    create(userId: number, dto: CreateExpenseDto): Promise<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        createdBy: number | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        createdBy: number | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>>;
    getStats(dateFrom?: string, dateTo?: string): Promise<{
        total: number | import("@prisma/client/runtime/library").Decimal;
        byCategory: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ExpenseGroupByOutputType, "category"[]> & {
            _count: number;
            _sum: {
                amount: import("@prisma/client/runtime/library").Decimal | null;
            };
        })[];
        availableBalance: number;
    }>;
    findOne(id: number): Promise<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        createdBy: number | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>;
    update(id: number, dto: UpdateExpenseDto): Promise<{
        creator: {
            email: string;
            id: number;
        } | null;
    } & {
        description: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        receiptNumber: string | null;
        createdBy: number | null;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        expenseDate: Date;
        attachments: string | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
