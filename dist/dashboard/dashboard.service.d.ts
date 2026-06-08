import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrgStats(orgId: number): Promise<{
        overview: {
            students: {
                total: number;
                active: number;
            };
            teachers: {
                total: number;
                active: number;
            };
            parents: number;
            sections: number;
        };
        todayAttendance: {
            present: number;
            absent: number;
            late: number;
            excused: number;
            total: number;
        };
        financial: {
            totalPaid: number;
            totalPending: number;
            totalPartial: number;
            totalExpenses: number;
            netBalance: number;
            budgetUsedPercentage: string;
        };
        assessments: {
            total: number;
            averagePercentage: string;
            gradeDistribution: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AssessmentGroupByOutputType, "grade"[]> & {
                _count: number;
            })[];
        };
        notifications: {
            unread: number;
        };
        gradeDistribution: {
            gradeName: string;
            studentCount: number;
        }[];
        recentPayments: ({
            student: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            status: import(".prisma/client").$Enums.PaymentStatus;
            academicYear: string;
            dueDate: Date;
            studentId: number;
            notes: string | null;
            finalAmount: import("@prisma/client/runtime/library").Decimal | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            paymentDate: Date | null;
            receiptNumber: string | null;
        })[];
        recentAbsences: ({
            student: {
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
        })[];
    }>;
    getPlatformStats(): Promise<{
        overview: {
            orgCount: number;
            activeOrgCount: number;
            subCount: number;
            activeSubCount: number;
            expiredSubCount: number;
            totalRevenue: number;
        };
        monthlyBreakdown: {
            month: string;
            year: number;
            revenue: number;
            newSubs: number;
        }[];
        recentOrgs: ({
            subscriptions: {
                id: number;
                createdAt: Date;
                organizationId: number;
                status: string;
                plan: string;
                price: import("@prisma/client/runtime/library").Decimal;
                startDate: Date;
                endDate: Date;
            }[];
        } & {
            name: string;
            type: string;
            email: string;
            slug: string;
            phone: string | null;
            id: number;
            address: string | null;
            logo: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    getFinancialSummary(orgId: number, month?: number, year?: number): Promise<{
        month: number;
        year: number;
        income: number;
        expenses: number;
        net: number;
        expensesByCategory: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ExpenseGroupByOutputType, "category"[]> & {
            _sum: {
                amount: import("@prisma/client/runtime/library").Decimal | null;
            };
        })[];
    }>;
    getAttendanceSummary(orgId: number, dateFrom?: string, dateTo?: string): Promise<{
        total: number;
        present: number;
        absent: number;
        late: number;
        excused: number;
        attendanceRate: string;
        topAbsentees: {
            student: {
                id: number;
                firstName: string;
                lastName: string;
            } | undefined;
            studentId: number;
            _count: {
                studentId: number;
            };
        }[];
    }>;
}
