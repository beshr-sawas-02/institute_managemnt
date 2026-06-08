import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAttendanceDto, BulkAttendanceDto, SmartBulkAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
type AttendanceResult = {
    order: number;
    studentId: number;
    name: string;
    status: string;
    lateMinutes: number;
};
export declare class AttendanceService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
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
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
                userId: number | null;
                firstName: string;
                lastName: string;
                relationship: import(".prisma/client").$Enums.Relationship;
            }) | null;
        } & {
            id: number;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            userId: number | null;
            firstName: string;
            lastName: string;
            status: import(".prisma/client").$Enums.StudentStatus;
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
    getSectionAttendanceSheet(orgId: number, sectionId: number, date: string): Promise<{
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
        data: AttendanceResult[];
    }>;
    findAll(orgId: number, filters?: {
        date?: string;
        sectionId?: number;
    }): Promise<({
        student: {
            section: ({
                grade: {
                    name: string;
                    description: string | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: number;
                    level: import(".prisma/client").$Enums.GradeLevel;
                };
            } & {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                organizationId: number;
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
    getStats(orgId: number, studentId: number, dateFrom?: string, dateTo?: string): Promise<{
        studentId: number;
        total: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendanceRate: number;
    }>;
    private handleAttendanceNotification;
}
export {};
