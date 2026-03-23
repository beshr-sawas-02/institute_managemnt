import { TeacherStatus } from '@prisma/client';
export declare class CreateTeacherDto {
    userId?: number;
    firstName: string;
    lastName: string;
    specialization: string;
    qualifications?: string;
    experienceYears?: number;
    bio?: string;
    salary?: number;
    status?: TeacherStatus;
    hireDate?: string;
}
declare const UpdateTeacherDto_base: import("@nestjs/common").Type<Partial<CreateTeacherDto>>;
export declare class UpdateTeacherDto extends UpdateTeacherDto_base {
}
export {};
