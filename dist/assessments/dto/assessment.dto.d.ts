import { AssessmentType } from '@prisma/client';
export declare class CreateAssessmentDto {
    studentId: number;
    gradeSubjectId: number;
    type: AssessmentType;
    title: string;
    maxScore: number;
    score?: number;
    feedback?: string;
    assessmentDate: string;
}
declare const UpdateAssessmentDto_base: import("@nestjs/common").Type<Partial<CreateAssessmentDto>>;
export declare class UpdateAssessmentDto extends UpdateAssessmentDto_base {
}
export {};
