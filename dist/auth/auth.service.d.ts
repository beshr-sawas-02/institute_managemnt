import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto, LoginDto, RefreshTokenDto, RegisterDto, UpdatePreferredLanguageDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            orgId: number;
            slug: string;
            organization: {
                id: number;
                name: string;
                nameAr: string | null;
                nameEn: string | null;
                type: string;
                typeAr: string | null;
                typeEn: string | null;
                slug: string;
                logo: string | null;
                isActive: true;
                hasActiveSubscription: boolean;
            };
            preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
            source: string;
        };
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
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
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
        organization: {
            hasActiveSubscription: boolean;
            name: string;
            type: string;
            slug: string;
            id: number;
            isActive: boolean;
            nameAr: string | null;
            nameEn: string | null;
            typeAr: string | null;
            typeEn: string | null;
            logo: string | null;
            subscriptions: {
                id: number;
                status: string;
                endDate: Date;
            }[];
        } | null;
        firstName: string | null;
        lastName: string | null;
        reception: {
            email: string;
            phone: string;
            id: number;
            organizationId: number;
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
            organizationId: number;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            userId: number | null;
            firstName: string;
            lastName: string;
            relationship: import(".prisma/client").$Enums.Relationship;
        } | null;
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
        } | null;
        student: {
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
        } | null;
        email: string;
        preferredLanguage: import(".prisma/client").$Enums.AppLanguage;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        id: number;
        organizationId: number;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
    }>;
    generateOrgTokens(userId: number, email: string, role: string, orgId: number): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generatePlatformTokens(userId: number, email: string, role: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
