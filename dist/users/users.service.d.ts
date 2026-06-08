import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(orgId: number, createUserDto: CreateUserDto): Promise<{
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    createParentUser(orgId: number, createUserDto: CreateUserDto): Promise<{
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    createReceptionUser(orgId: number, createUserDto: CreateUserDto): Promise<{
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<PaginatedResult<{
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
        lastLogin: Date | null;
    }>>;
    findOne(orgId: number, id: number): Promise<{
        reception: {
            email: string;
            phone: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            organizationId: number;
            userId: number | null;
            firstName: string;
            lastName: string;
        } | null;
        parent: {
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
        } | null;
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
        } | null;
        student: {
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
        } | null;
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
        lastLogin: Date | null;
    }>;
    update(orgId: number, id: number, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        updatedAt: Date;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
