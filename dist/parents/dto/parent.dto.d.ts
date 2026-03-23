import { Relationship } from '@prisma/client';
export declare class CreateParentDto {
    userId?: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address?: string;
    relationship: Relationship;
}
declare const UpdateParentDto_base: import("@nestjs/common").Type<Partial<CreateParentDto>>;
export declare class UpdateParentDto extends UpdateParentDto_base {
}
export {};
