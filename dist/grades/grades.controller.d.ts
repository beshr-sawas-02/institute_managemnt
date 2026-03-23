import { GradesService } from './grades.service';
import { CreateGradeDto, UpdateGradeDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class GradesController {
    private readonly gradesService;
    constructor(gradesService: GradesService);
    create(createGradeDto: CreateGradeDto): Promise<{
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        gradeSubjects: ({
            teacher: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
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
                description: string | null;
                name: string;
                id: number;
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
        })[];
        sections: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SectionStatus;
            academicYear: string;
            gradeId: number;
            maxStudents: number | null;
        }[];
    } & {
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>>;
    findOne(id: number): Promise<{
        gradeSubjects: ({
            teacher: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
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
                description: string | null;
                name: string;
                id: number;
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
        })[];
        sections: ({
            students: {
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
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SectionStatus;
            academicYear: string;
            gradeId: number;
            maxStudents: number | null;
        })[];
    } & {
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    update(id: number, updateGradeDto: UpdateGradeDto): Promise<{
        description: string | null;
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        level: import(".prisma/client").$Enums.GradeLevel;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
