import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, ResetOrganizationAdminPasswordDto, UpdateOrganizationDto } from './dto/organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class OrganizationsController {
    private readonly service;
    constructor(service: OrganizationsService);
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
    findAll(p: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
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
    resetAdminPassword(id: number, dto: ResetOrganizationAdminPasswordDto): Promise<{
        message: string;
        email: string;
    }>;
    uploadLogo(id: number, file?: {
        filename: string;
    }): Promise<{
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
    remove(id: number): Promise<{
        message: string;
    }>;
}
