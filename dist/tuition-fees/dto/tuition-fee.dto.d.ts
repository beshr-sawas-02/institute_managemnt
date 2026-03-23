export declare class CreateTuitionFeeDto {
    gradeId: number;
    academicYear: string;
    annualAmount: number;
    description?: string;
}
declare const UpdateTuitionFeeDto_base: import("@nestjs/common").Type<Partial<CreateTuitionFeeDto>>;
export declare class UpdateTuitionFeeDto extends UpdateTuitionFeeDto_base {
}
export {};
