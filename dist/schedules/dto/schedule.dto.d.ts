import { DayOfWeek, ScheduleStatus } from '@prisma/client';
export declare class CreateScheduleDto {
    sectionId: number;
    gradeSubjectId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    room?: string;
    status?: ScheduleStatus;
}
declare const UpdateScheduleDto_base: import("@nestjs/common").Type<Partial<CreateScheduleDto>>;
export declare class UpdateScheduleDto extends UpdateScheduleDto_base {
}
export {};
