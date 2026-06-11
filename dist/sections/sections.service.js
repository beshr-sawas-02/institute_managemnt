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
exports.SectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let SectionsService = class SectionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, createSectionDto) {
        await this.ensureGradeBelongsToOrg(orgId, createSectionDto.gradeId);
        return this.prisma.section.create({
            data: { ...createSectionDto, organizationId: orgId },
            include: { grade: true },
        });
    }
    async findAll(orgId, paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = { organizationId: orgId };
        if (search)
            where.name = { contains: search };
        const [data, total] = await Promise.all([
            this.prisma.section.findMany({
                where,
                skip,
                take: limit,
                include: {
                    grade: true,
                    _count: { select: { students: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.section.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(orgId, id) {
        const section = await this.prisma.section.findFirst({
            where: { id, organizationId: orgId },
            include: {
                grade: true,
                students: { where: { status: 'active' } },
                schedules: {
                    include: {
                        gradeSubject: { include: { subject: true, teacher: true } },
                    },
                },
            },
        });
        if (!section)
            throw new common_1.NotFoundException('الشعبة غير موجودة');
        return section;
    }
    async findByGrade(orgId, gradeId) {
        return this.prisma.section.findMany({
            where: { gradeId, organizationId: orgId, status: 'active' },
            include: {
                grade: true,
                _count: { select: { students: true } },
            },
        });
    }
    async update(orgId, id, updateSectionDto) {
        await this.findOne(orgId, id);
        if (updateSectionDto.gradeId !== undefined) {
            await this.ensureGradeBelongsToOrg(orgId, updateSectionDto.gradeId);
        }
        return this.prisma.section.update({
            where: { id },
            data: updateSectionDto,
            include: { grade: true },
        });
    }
    async ensureGradeBelongsToOrg(orgId, gradeId) {
        const grade = await this.prisma.grade.findFirst({
            where: { id: gradeId, organizationId: orgId },
            select: { id: true },
        });
        if (!grade)
            throw new common_1.NotFoundException('الصف غير موجود');
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.section.delete({ where: { id } });
        return { message: 'تم حذف الشعبة بنجاح' };
    }
};
exports.SectionsService = SectionsService;
exports.SectionsService = SectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SectionsService);
//# sourceMappingURL=sections.service.js.map