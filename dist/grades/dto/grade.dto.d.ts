import { GradeLevel } from '@prisma/client';
export declare class CreateGradeDto {
    name: string;
    level: GradeLevel;
    description?: string;
}
declare const UpdateGradeDto_base: import("@nestjs/common").Type<Partial<CreateGradeDto>>;
export declare class UpdateGradeDto extends UpdateGradeDto_base {
}
export {};
