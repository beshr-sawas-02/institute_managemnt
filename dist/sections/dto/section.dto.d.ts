import { SectionStatus } from '@prisma/client';
export declare class CreateSectionDto {
    gradeId: number;
    name: string;
    academicYear: string;
    maxStudents?: number;
    status?: SectionStatus;
}
declare const UpdateSectionDto_base: import("@nestjs/common").Type<Partial<CreateSectionDto>>;
export declare class UpdateSectionDto extends UpdateSectionDto_base {
}
export {};
