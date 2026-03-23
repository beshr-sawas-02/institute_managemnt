import { PaymentStatus } from '@prisma/client';
export declare class CreatePaymentDto {
    studentId: number;
    academicYear: string;
    amount: number;
    discount?: number;
    status?: PaymentStatus;
    dueDate: string;
    paymentDate?: string;
    notes?: string;
}
declare const UpdatePaymentDto_base: import("@nestjs/common").Type<Partial<CreatePaymentDto>>;
export declare class UpdatePaymentDto extends UpdatePaymentDto_base {
}
export {};
