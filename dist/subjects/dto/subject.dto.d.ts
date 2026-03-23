export declare class CreateSubjectDto {
    name: string;
    description?: string;
}
declare const UpdateSubjectDto_base: import("@nestjs/common").Type<Partial<CreateSubjectDto>>;
export declare class UpdateSubjectDto extends UpdateSubjectDto_base {
}
export {};
