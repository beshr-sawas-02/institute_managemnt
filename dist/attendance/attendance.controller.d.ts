import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, BulkAttendanceDto, SmartBulkAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(orgId: number, dto: CreateAttendanceDto): Promise<{
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
                organizationId: number;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                userId: number | null;
                firstName: string;
                lastName: string;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.StudentStatus;
            address: string | null;
            userId: number | null;
            firstName: string;
            lastName: string;
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
    bulkCreate(orgId: number, dto: BulkAttendanceDto): Promise<{
        message: string;
        data: any[];
    }>;
    smartBulkCreate(orgId: number, dto: SmartBulkAttendanceDto): Promise<{
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
    getSectionSheet(orgId: number, sectionId: number, date: string): Promise<{
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
    findAll(orgId: number, date?: string, sectionId?: string): Promise<({
        student: {
            section: ({
                grade: {
                    name: string;
                    description: string | null;
                    id: number;
                    organizationId: number;
                    createdAt: Date;
                    updatedAt: Date;
                    level: import(".prisma/client").$Enums.GradeLevel;
                };
            } & {
                name: string;
                id: number;
                organizationId: number;
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
    findBySection(orgId: number, sectionId: number, date: string): Promise<({
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
    findByStudent(orgId: number, studentId: number, dateFrom?: string, dateTo?: string): Promise<{
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
    getStats(orgId: number, studentId: number, dateFrom?: string, dateTo?: string): Promise<{
        studentId: number;
        total: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendanceRate: number;
    }>;
    findOne(orgId: number, id: number): Promise<{
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
    update(orgId: number, id: number, dto: UpdateAttendanceDto): Promise<{
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
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
