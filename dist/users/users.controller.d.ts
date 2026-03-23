import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    createParentUser(createUserDto: CreateUserDto): Promise<{
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    createReceptionUser(createUserDto: CreateUserDto): Promise<{
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    findAll(paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
    }>>;
    findOne(id: number): Promise<{
        reception: {
            email: string;
            phone: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number | null;
            firstName: string;
            lastName: string;
        } | null;
        parent: {
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
        } | null;
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
        } | null;
        student: {
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
        } | null;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
