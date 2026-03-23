import { AttendanceStatus } from '@prisma/client';
export declare class CreateAttendanceDto {
    studentId: number;
    date: string;
    status: AttendanceStatus;
    lateMinutes?: number;
    notes?: string;
}
export declare class BulkStudentAttendanceDto {
    studentId: number;
    status: AttendanceStatus;
    lateMinutes?: number;
    notes?: string;
}
export declare class BulkAttendanceDto {
    sectionId: number;
    date: string;
    students: BulkStudentAttendanceDto[];
}
export declare class ExceptionStudentDto {
    studentId: number;
    status: AttendanceStatus;
    lateMinutes?: number;
    notes?: string;
}
export declare class SmartBulkAttendanceDto {
    sectionId: number;
    date: string;
    exceptions?: ExceptionStudentDto[];
}
export declare class UpdateAttendanceDto {
    status?: AttendanceStatus;
    lateMinutes?: number;
    notes?: string;
}
