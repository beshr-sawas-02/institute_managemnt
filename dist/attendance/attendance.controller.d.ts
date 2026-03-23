import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, BulkAttendanceDto, SmartBulkAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(dto: CreateAttendanceDto): Promise<{
        student: {
            parent: ({
                user: {
                    email: string;
                    role: import(".prisma/client").$Enums.UserRole;
                    id: number;
                } | null;
            } & {
                email: string | null;
                phone: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                userId: number | null;
                firstName: string;
                lastName: string;
                address: string | null;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            parentId: number | null;
            sectionId: number | null;
            dateOfBirth: Date;
            gender: import(".prisma/client").$Enums.Gender;
            academicYear: string | null;
            registrationDate: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        studentId: number;
        lateMinutes: number;
        notes: string | null;
        parentNotified: boolean;
        notificationSentAt: Date | null;
    }>;
    bulkCreate(dto: BulkAttendanceDto): Promise<{
        message: string;
        data: any[];
    }>;
    smartBulkCreate(dto: SmartBulkAttendanceDto): Promise<{
        message: string;
        date: string;
        sectionId: number;
        summary: {
            total: number;
            present: number;
            absent: number;
            late: number;
            excused: number;
        };
        data: {
            order: number;
            studentId: number;
            name: string;
            status: string;
            lateMinutes: number;
        }[];
    }>;
    getSectionSheet(sectionId: number, date: string): Promise<{
        sectionId: number;
        date: string;
        totalStudents: number;
        registered: number;
        isComplete: boolean;
        students: {
            order: number;
            studentId: number;
            name: string;
            attendance: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.AttendanceStatus;
                date: Date;
                studentId: number;
                lateMinutes: number;
                notes: string | null;
                parentNotified: boolean;
                notificationSentAt: Date | null;
            } | null;
        }[];
    }>;
    findAll(date?: string, sectionId?: string): Promise<({
        student: {
            section: ({
                grade: {
                    description: string | null;
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    level: import(".prisma/client").$Enums.GradeLevel;
                };
            } & {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.SectionStatus;
                academicYear: string;
                gradeId: number;
                maxStudents: number | null;
            }) | null;
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        studentId: number;
        lateMinutes: number;
        notes: string | null;
        parentNotified: boolean;
        notificationSentAt: Date | null;
    })[]>;
    findBySection(sectionId: number, date: string): Promise<({
        student: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        studentId: number;
        lateMinutes: number;
        notes: string | null;
        parentNotified: boolean;
        notificationSentAt: Date | null;
    })[]>;
    findByStudent(studentId: number, dateFrom?: string, dateTo?: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        studentId: number;
        lateMinutes: number;
        notes: string | null;
        parentNotified: boolean;
        notificationSentAt: Date | null;
    }[]>;
    getStats(studentId: number, dateFrom?: string, dateTo?: string): Promise<{
        studentId: number;
        total: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendanceRate: number;
    }>;
    findOne(id: number): Promise<{
        student: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        studentId: number;
        lateMinutes: number;
        notes: string | null;
        parentNotified: boolean;
        notificationSentAt: Date | null;
    }>;
    update(id: number, dto: UpdateAttendanceDto): Promise<{
        student: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        date: Date;
        studentId: number;
        lateMinutes: number;
        notes: string | null;
        parentNotified: boolean;
        notificationSentAt: Date | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
