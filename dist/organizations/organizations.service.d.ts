import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateOrganizationDto): Promise<{
        organization: {
            subscriptions: {
                id: number;
                organizationId: number;
                createdAt: Date;
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            nameAr: string | null;
            nameEn: string | null;
            typeAr: string | null;
            typeEn: string | null;
            address: string | null;
            logo: string | null;
        };
        credentials: {
            email: string;
            password: string;
        };
    }>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<{
        subscriptions: {
            id: number;
            organizationId: number;
            createdAt: Date;
            status: string;
            plan: string;
            price: import("@prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
        }[];
        _count: {
            users: number;
            students: number;
        };
    } & {
        name: string;
        type: string;
        email: string;
        slug: string;
        phone: string | null;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        nameEn: string | null;
        typeAr: string | null;
        typeEn: string | null;
        address: string | null;
        logo: string | null;
    }>>;
    findOne(id: number): Promise<{
        subscriptions: {
            id: number;
            organizationId: number;
            createdAt: Date;
            status: string;
            plan: string;
            price: import("@prisma/client/runtime/library").Decimal;
            startDate: Date;
            endDate: Date;
        }[];
        _count: {
            users: number;
            students: number;
            teachers: number;
        };
    } & {
        name: string;
        type: string;
        email: string;
        slug: string;
        phone: string | null;
        id: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        nameEn: string | null;
        typeAr: string | null;
        typeEn: string | null;
        address: string | null;
        logo: string | null;
    }>;
    update(id: number, dto: UpdateOrganizationDto): Promise<({
        subscriptions: {
            id: number;
            organizationId: number;
            createdAt: Date;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        nameEn: string | null;
        typeAr: string | null;
        typeEn: string | null;
        address: string | null;
        logo: string | null;
    }) | null>;
    updateLogo(id: number, logo: string): Promise<{
        subscriptions: {
            id: number;
            organizationId: number;
            createdAt: Date;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        nameAr: string | null;
        nameEn: string | null;
        typeAr: string | null;
        typeEn: string | null;
        address: string | null;
        logo: string | null;
    }>;
    resetAdminPassword(id: number, newPassword: string): Promise<{
        message: string;
        email: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
