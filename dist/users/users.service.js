"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                preferredLanguage: createUserDto.preferredLanguage ?? 'ar',
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                preferredLanguage: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    async createParentUser(createUserDto) {
        if (createUserDto.role !== client_1.UserRole.parent) {
            throw new common_1.BadRequestException('Role must be parent');
        }
        const parent = await this.prisma.parent.findFirst({
            where: { email: createUserDto.email },
            select: { id: true, userId: true },
        });
        if (!parent) {
            throw new common_1.NotFoundException('No parent found with this email');
        }
        if (parent.userId) {
            throw new common_1.ConflictException('This parent already has a user account');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    ...createUserDto,
                    role: client_1.UserRole.parent,
                    preferredLanguage: createUserDto.preferredLanguage ?? 'ar',
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    preferredLanguage: true,
                    isActive: true,
                    createdAt: true,
                },
            });
            await tx.parent.update({
                where: { id: parent.id },
                data: { userId: user.id },
            });
            return user;
        });
    }
    async createReceptionUser(createUserDto) {
        const reception = await this.prisma.reception.findFirst({
            where: { email: createUserDto.email },
            select: { id: true, userId: true },
        });
        if (!reception) {
            throw new common_1.NotFoundException('No reception found with this email');
        }
        if (reception.userId) {
            throw new common_1.ConflictException('This reception already has a user account');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    ...createUserDto,
                    role: client_1.UserRole.reception,
                    preferredLanguage: createUserDto.preferredLanguage ?? 'ar',
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    preferredLanguage: true,
                    isActive: true,
                    createdAt: true,
                },
            });
            await tx.reception.update({
                where: { id: reception.id },
                data: { userId: user.id },
            });
            return user;
        });
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { email: { contains: search } },
                    { phone: { contains: search } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    role: true,
                    preferredLanguage: true,
                    isActive: true,
                    lastLogin: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                preferredLanguage: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                student: true,
                teacher: true,
                parent: true,
                reception: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('المستخدم غير موجود');
        }
        return user;
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        const data = { ...updateUserDto };
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 12);
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                preferredLanguage: true,
                isActive: true,
                updatedAt: true,
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.user.delete({ where: { id } });
        return { message: 'تم حذف المستخدم بنجاح' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map