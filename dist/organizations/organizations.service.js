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
let OrganizationsService = class OrganizationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.organization.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('هذا المعرف مستخدم بالفعل');
        }
        return this.prisma.organization.create({
            data: dto,
            include: { subscriptions: true },
        });
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
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
        return this.prisma.organization.update({
            where: { id },
            data: dto,
            include: { subscriptions: true },
        });
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