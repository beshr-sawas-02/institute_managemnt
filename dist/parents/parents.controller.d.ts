import { ParentsService } from './parents.service';
import { CreateParentDto, UpdateParentDto } from './dto/parent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ParentsController {
    private readonly parentsService;
    constructor(parentsService: ParentsService);
    create(orgId: number, createParentDto: CreateParentDto): Promise<{
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
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        user: {
            email: string;
            id: number;
        } | null;
        students: {
            id: number;
            firstName: string;
            lastName: string;
        }[];
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
    }>>;
    findOne(orgId: number, id: number): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
        students: ({
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
        })[];
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
    }>;
    update(orgId: number, id: number, updateParentDto: UpdateParentDto): Promise<{
        user: {
            email: string;
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
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
