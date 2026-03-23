export declare class CreateGradeSubjectDto {
    gradeId: number;
    subjectId: number;
    teacherId: number;
    sectionId: number;
}
declare const UpdateGradeSubjectDto_base: import("@nestjs/common").Type<Partial<CreateGradeSubjectDto>>;
export declare class UpdateGradeSubjectDto extends UpdateGradeSubjectDto_base {
}
export {};
