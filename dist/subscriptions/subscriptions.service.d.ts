import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto, ExtendSubscriptionDto } from './dto/subscription.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSubscriptionDto: CreateSubscriptionDto): Promise<{
        organization: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        organizationId: number;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<{
        organization: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        organizationId: number;
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
            address: string | null;
            logo: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        organizationId: number;
        status: string;
        plan: string;
        price: import("@prisma/client/runtime/library").Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    update(id: number, updateSubscriptionDto: UpdateSubscriptionDto): Promise<{
        organization: {
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
        };
    } & {
        id: number;
        createdAt: Date;
        organizationId: number;
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
            address: string | null;
            logo: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        organizationId: number;
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
            address: string | null;
            logo: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        organizationId: number;
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
