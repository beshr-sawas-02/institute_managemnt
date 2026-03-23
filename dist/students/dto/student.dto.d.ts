import { Gender, StudentStatus } from '@prisma/client';
export declare class CreateStudentDto {
    userId?: number;
    parentId?: number;
    sectionId?: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    address?: string;
    academicYear?: string;
    status?: StudentStatus;
}
declare const UpdateStudentDto_base: import("@nestjs/common").Type<Partial<CreateStudentDto>>;
export declare class UpdateStudentDto extends UpdateStudentDto_base {
}
export {};
