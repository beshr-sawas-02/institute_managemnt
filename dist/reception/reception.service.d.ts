import { PrismaService } from '../prisma/prisma.service';
import { CreateReceptionDto, UpdateReceptionDto } from './dto/reception.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
export declare class ReceptionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createReceptionDto: CreateReceptionDto): Promise<{
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
        userId: number | null;
        firstName: string;
        lastName: string;
    }>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<{
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
        userId: number | null;
        firstName: string;
        lastName: string;
    }>>;
    findOne(id: number): Promise<{
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
        userId: number | null;
        firstName: string;
        lastName: string;
    }>;
    update(id: number, updateReceptionDto: UpdateReceptionDto): Promise<{
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
        userId: number | null;
        firstName: string;
        lastName: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
