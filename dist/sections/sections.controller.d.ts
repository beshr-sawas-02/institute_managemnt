import { SectionsService } from './sections.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SectionsController {
    private readonly sectionsService;
    constructor(sectionsService: SectionsService);
    create(orgId: number, dto: CreateSectionDto): Promise<{
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
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        grade: {
            name: string;
            description: string | null;
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        _count: {
            students: number;
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
    }>>;
    findByGrade(orgId: number, gradeId: number): Promise<({
        grade: {
            name: string;
            description: string | null;
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        _count: {
            students: number;
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
    })[]>;
    findOne(orgId: number, id: number): Promise<{
        grade: {
            name: string;
            description: string | null;
            id: number;
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            level: import(".prisma/client").$Enums.GradeLevel;
        };
        students: {
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
        }[];
        schedules: ({
            gradeSubject: {
                teacher: {
                    id: number;
                    organizationId: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: import(".prisma/client").$Enums.TeacherStatus;
                    userId: number | null;
                    firstName: string;
                    lastName: string;
                    specialization: string;
                    qualifications: string | null;
                    experienceYears: number | null;
                    bio: string | null;
                    salary: import("@prisma/client/runtime/library").Decimal | null;
                    hireDate: Date | null;
                };
                subject: {
                    name: string;
                    description: string | null;
                    id: number;
                    organizationId: number;
                    createdAt: Date;
                    updatedAt: Date;
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
        organizationId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.SectionStatus;
        academicYear: string;
        gradeId: number;
        maxStudents: number | null;
    }>;
    update(orgId: number, id: number, dto: UpdateSectionDto): Promise<{
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
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
