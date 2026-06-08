import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class OrganizationsController {
    private readonly service;
    constructor(service: OrganizationsService);
    create(dto: CreateOrganizationDto): Promise<{
        subscriptions: {
            id: number;
            createdAt: Date;
            organizationId: number;
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
        address: string | null;
        logo: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(p: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        subscriptions: {
            id: number;
            createdAt: Date;
            organizationId: number;
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
        address: string | null;
        logo: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>>;
    findOne(id: number): Promise<{
        subscriptions: {
            id: number;
            createdAt: Date;
            organizationId: number;
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
        address: string | null;
        logo: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: UpdateOrganizationDto): Promise<{
        subscriptions: {
            id: number;
            createdAt: Date;
            organizationId: number;
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
        address: string | null;
        logo: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
