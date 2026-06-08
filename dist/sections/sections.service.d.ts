import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class SectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: number, createSectionDto: CreateSectionDto): Promise<{
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
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        grade: {
            name: string;
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        _count: {
            students: number;
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
    }>>;
    findOne(orgId: number, id: number): Promise<{
        grade: {
            name: string;
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        students: {
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
        }[];
        schedules: ({
            gradeSubject: {
                teacher: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: number;
                    userId: number | null;
                    firstName: string;
                    lastName: string;
                    specialization: string;
                    qualifications: string | null;
                    experienceYears: number | null;
                    bio: string | null;
                    salary: import("@prisma/client/runtime/library").Decimal | null;
                    status: import(".prisma/client").$Enums.TeacherStatus;
                    hireDate: Date | null;
                };
                subject: {
                    name: string;
                    description: string | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    organizationId: number;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                sectionId: number | null;
                gradeId: number;
                subjectId: number;
                teacherId: number;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ScheduleStatus;
            sectionId: number;
            gradeSubjectId: number;
            dayOfWeek: import(".prisma/client").$Enums.DayOfWeek;
            startTime: Date;
            endTime: Date;
            room: string | null;
        })[];
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
    }>;
    findByGrade(orgId: number, gradeId: number): Promise<({
        grade: {
            name: string;
            description: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        _count: {
            students: number;
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
    })[]>;
    update(orgId: number, id: number, updateSectionDto: UpdateSectionDto): Promise<{
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
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
