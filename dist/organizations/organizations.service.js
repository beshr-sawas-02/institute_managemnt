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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const bcrypt = require("bcrypt");
let OrganizationsService = class OrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const [existingOrganization, existingUser] = await Promise.all([
            this.prisma.organization.findUnique({ where: { slug: dto.slug } }),
            this.prisma.user.findUnique({ where: { email: dto.email } }),
        ]);
        if (existingOrganization) {
            throw new common_1.ConflictException('هذا المعرف مستخدم بالفعل');
        }
        if (existingUser) {
            throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
        }
        const { adminPassword, nameAr, nameEn, ...organizationData } = dto;
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        const organization = await this.prisma.$transaction(async (tx) => {
            const createdOrganization = await tx.organization.create({
                data: {
                    ...organizationData,
                    name: nameAr,
                    nameAr,
                    nameEn,
                    typeAr: organizationData.type === 'school' ? 'مدرسة' : 'معهد',
                    typeEn: organizationData.type === 'school' ? 'School' : 'Institute',
                    isActive: false,
                },
                include: { subscriptions: true },
            });
            await tx.user.create({
                data: {
                    organizationId: createdOrganization.id,
                    email: createdOrganization.email,
                    password: hashedPassword,
                    phone: createdOrganization.phone,
                    role: 'admin',
                    isActive: true,
                },
            });
            return createdOrganization;
        });
        return {
            organization,
            credentials: {
                email: organization.email,
                password: adminPassword,
            },
        };
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { nameAr: { contains: search } },
                { nameEn: { contains: search } },
                { slug: { contains: search } },
                { email: { contains: search } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.organization.findMany({
                where,
                skip,
                take: limit,
                include: {
                    subscriptions: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                    _count: {
                        select: { users: true, students: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.organization.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id) {
        const org = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                subscriptions: { orderBy: { createdAt: 'desc' } },
                _count: {
                    select: { users: true, students: true, teachers: true },
                },
            },
        });
        if (!org)
            throw new common_1.NotFoundException('المؤسسة غير موجودة');
        return org;
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.slug) {
            const existing = await this.prisma.organization.findFirst({
                where: { slug: dto.slug, id: { not: id } },
            });
            if (existing)
                throw new common_1.ConflictException('هذا المعرف مستخدم بالفعل');
        }
        return this.prisma.$transaction(async (tx) => {
            if (dto.isActive === true) {
                const activeSubscription = await tx.subscription.findFirst({
                    where: { organizationId: id, status: 'active' },
                    select: { id: true },
                });
                if (!activeSubscription) {
                    throw new common_1.BadRequestException('لا يمكن تنشيط المؤسسة قبل إضافة اشتراك نشط لها');
                }
            }
            const { isActive, nameAr, type, ...rest } = dto;
            const organization = await tx.organization.update({
                where: { id },
                data: {
                    ...rest,
                    ...(nameAr !== undefined ? { nameAr, name: nameAr } : {}),
                    ...(type !== undefined
                        ? {
                            type,
                            typeAr: type === 'school' ? 'مدرسة' : 'معهد',
                            typeEn: type === 'school' ? 'School' : 'Institute',
                        }
                        : {}),
                    ...(isActive !== undefined ? { isActive } : {}),
                },
                include: { subscriptions: true },
            });
            if (dto.isActive !== undefined) {
                await tx.subscription.updateMany({
                    where: {
                        organizationId: id,
                        status: dto.isActive ? 'paused' : 'active',
                    },
                    data: { status: dto.isActive ? 'active' : 'paused' },
                });
                return tx.organization.findUnique({
                    where: { id },
                    include: { subscriptions: true },
                });
            }
            return organization;
        });
    }
    async updateLogo(id, logo) {
        const organization = await this.findOne(id);
        const updatedOrganization = await this.prisma.organization.update({
            where: { id },
            data: { logo },
            include: { subscriptions: true },
        });
        if (organization.logo?.startsWith(`/uploads/organizations/${id}/`)) {
            const oldLogoPath = (0, path_1.join)(process.cwd(), organization.logo.replace(/^\/+/, ''));
            await (0, promises_1.unlink)(oldLogoPath).catch(() => undefined);
        }
        return updatedOrganization;
    }
    async resetAdminPassword(id, newPassword) {
        const organization = await this.findOne(id);
        const admin = (await this.prisma.user.findFirst({
            where: {
                organizationId: id,
                role: 'admin',
                email: organization.email,
            },
        })) ??
            (await this.prisma.user.findFirst({
                where: { organizationId: id, role: 'admin' },
                orderBy: { id: 'asc' },
            }));
        if (!admin) {
            throw new common_1.NotFoundException('لا يوجد حساب مدير لهذه المؤسسة');
        }
        await this.prisma.user.update({
            where: { id: admin.id },
            data: {
                password: await bcrypt.hash(newPassword, 12),
                isActive: true,
            },
        });
        return {
            message: 'تم تغيير كلمة مرور مدير المؤسسة بنجاح',
            email: admin.email,
        };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.organization.delete({ where: { id } });
        return { message: 'تم حذف المؤسسة بنجاح' };
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map