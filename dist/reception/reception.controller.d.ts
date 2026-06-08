import { ReceptionService } from './reception.service';
import { CreateReceptionDto, UpdateReceptionDto } from './dto/reception.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class ReceptionController {
    private readonly receptionService;
    constructor(receptionService: ReceptionService);
    create(orgId: number, createReceptionDto: CreateReceptionDto): Promise<{
        user: {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: number;
        } | null;
    } & {
        email: string;
        phone: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        userId: number | null;
        firstName: string;
        lastName: string;
    }>;
    findAll(orgId: number, paginationDto: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        user: {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: number;
        } | null;
    } & {
        email: string;
        phone: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        userId: number | null;
        firstName: string;
        lastName: string;
    }>>;
    findOne(orgId: number, id: number): Promise<{
        user: {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: number;
        } | null;
    } & {
        email: string;
        phone: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        userId: number | null;
        firstName: string;
        lastName: string;
    }>;
    update(orgId: number, id: number, updateReceptionDto: UpdateReceptionDto): Promise<{
        user: {
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: number;
        } | null;
    } & {
        email: string;
        phone: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: number;
        userId: number | null;
        firstName: string;
        lastName: string;
    }>;
    remove(orgId: number, id: number): Promise<{
        message: string;
    }>;
}
