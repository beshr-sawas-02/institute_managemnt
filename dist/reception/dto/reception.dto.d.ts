export declare class CreateReceptionDto {
    userId?: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
declare const UpdateReceptionDto_base: import("@nestjs/common").Type<Partial<CreateReceptionDto>>;
export declare class UpdateReceptionDto extends UpdateReceptionDto_base {
}
export {};
