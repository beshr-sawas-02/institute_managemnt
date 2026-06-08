import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RefreshTokenDto, RegisterDto, UpdatePreferredLanguageDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            orgId: number;
            preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
            source: string;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            orgId: number;
            preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
            source: string;
        };
    }>;
    registerReception(orgId: number, createUserDto: CreateUserDto): Promise<{
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    updatePreferredLanguage(userId: number, dto: UpdatePreferredLanguageDto): Promise<{
        message: string;
        user: {
            preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
            id: number;
            updatedAt: Date;
        };
    }>;
    getProfile(userId: number): Promise<{
        firstName: string | null;
        lastName: string | null;
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
        organizationId: number;
        lastLogin: Date | null;
    }>;
}
