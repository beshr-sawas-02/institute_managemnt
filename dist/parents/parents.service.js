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
exports.ParentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let ParentsService = class ParentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, createParentDto) {
        await this.ensureUserBelongsToOrg(orgId, createParentDto.userId);
        return this.prisma.parent.create({
            data: { ...createParentDto, organizationId: orgId },
            include: { user: { select: { id: true, email: true, role: true } } },
        });
    }
    async findAll(orgId, paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = { organizationId: orgId };
        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { phone: { contains: search } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.parent.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, email: true } },
                    students: { select: { id: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.parent.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(orgId, id) {
        const parent = await this.prisma.parent.findFirst({
            where: { id, organizationId: orgId },
            include: {
                user: { select: { id: true, email: true } },
                students: {
                    include: { section: { include: { grade: true } } },
                },
            },
        });
        if (!parent)
            throw new common_1.NotFoundException('ولي الأمر غير موجود');
        return parent;
    }
    async update(orgId, id, updateParentDto) {
        await this.findOne(orgId, id);
        await this.ensureUserBelongsToOrg(orgId, updateParentDto.userId);
        return this.prisma.parent.update({
            where: { id },
            data: updateParentDto,
            include: { user: { select: { id: true, email: true } } },
        });
    }
    async ensureUserBelongsToOrg(orgId, userId) {
        if (userId === undefined)
            return;
        const user = await this.prisma.user.findFirst({
            where: { id: userId, organizationId: orgId },
            select: { id: true },
        });
        if (!user)
            throw new common_1.NotFoundException('المستخدم غير موجود');
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.parent.delete({ where: { id } });
        return { message: 'تم حذف ولي الأمر بنجاح' };
    }
};
exports.ParentsService = ParentsService;
exports.ParentsService = ParentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParentsService);
//# sourceMappingURL=parents.service.js.map