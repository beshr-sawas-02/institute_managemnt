import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto, ExtendSubscriptionDto, UpdateSubscriptionStatusDto } from './dto/subscription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    create(dto: CreateSubscriptionDto): Promise<{
        organization: {
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
    } & {
        id: number;
        organizationId: number;
        createdAt: Date;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(p: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        organization: {
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
    } & {
        id: number;
        organizationId: number;
        createdAt: Date;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>>;
    findOne(id: number): Promise<{
        organization: {
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
    } & {
        id: number;
        organizationId: number;
        createdAt: Date;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    update(id: number, dto: UpdateSubscriptionDto): Promise<{
        organization: {
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
    } & {
        id: number;
        organizationId: number;
        createdAt: Date;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    updateStatus(id: number, dto: UpdateSubscriptionStatusDto): Promise<{
        organization: {
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
    } & {
        id: number;
        organizationId: number;
        createdAt: Date;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    extend(id: number, dto: ExtendSubscriptionDto): Promise<{
        organization: {
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
    } & {
        id: number;
        organizationId: number;
        createdAt: Date;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    pause(id: number): Promise<{
        organization: {
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
    } & {
        id: number;
        organizationId: number;
        createdAt: Date;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
