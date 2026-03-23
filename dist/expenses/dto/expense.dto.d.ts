import { ExpenseCategory } from '@prisma/client';
export declare class CreateExpenseDto {
    category: ExpenseCategory;
    description: string;
    amount: number;
    expenseDate: string;
    receiptNumber?: string;
    attachments?: string;
}
declare const UpdateExpenseDto_base: import("@nestjs/common").Type<Partial<CreateExpenseDto>>;
export declare class UpdateExpenseDto extends UpdateExpenseDto_base {
}
export {};
