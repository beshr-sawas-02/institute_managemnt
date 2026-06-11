import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto, ExtendSubscriptionDto, UpdateSubscriptionStatusDto } from './dto/subscription.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class SubscriptionsService {
    private prisma;
    constructor(prisma: PrismaService);
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
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
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
        price: Prisma.Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private parseDate;
    private today;
    private validateNewDates;
    private setStatusAndSyncOrganization;
    private syncOrganizationStatus;
}
