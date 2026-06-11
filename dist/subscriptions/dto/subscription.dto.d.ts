export declare class CreateSubscriptionDto {
    organizationId: number;
    plan: string;
    price: number;
    startDate: string;
    endDate: string;
}
declare const UpdateSubscriptionDto_base: import("@nestjs/common").Type<Partial<CreateSubscriptionDto>>;
export declare class UpdateSubscriptionDto extends UpdateSubscriptionDto_base {
}
export declare class ExtendSubscriptionDto {
    endDate: string;
}
export declare class UpdateSubscriptionStatusDto {
    status: 'active' | 'paused';
}
export {};
