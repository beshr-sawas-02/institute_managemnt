import { ParentsService } from './parents.service';
import { CreateParentDto, UpdateParentDto } from './dto/parent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ParentsController {
    private readonly parentsService;
    constructor(parentsService: ParentsService);
    create(createParentDto: CreateParentDto): Promise<{
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
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
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
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        firstName: string;
        lastName: string;
        address: string | null;
        relationship: import(".prisma/client").$Enums.Relationship;
    }>>;
    findOne(id: number): Promise<{
        user: {
            email: string;
            id: number;
        } | null;
        students: ({
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
        })[];
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
    }>;
    update(id: number, updateParentDto: UpdateParentDto): Promise<{
        user: {
            email: string;
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
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
