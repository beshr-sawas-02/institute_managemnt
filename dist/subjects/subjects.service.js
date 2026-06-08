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
exports.SubjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let SubjectsService = class SubjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orgId, dto) {
        return this.prisma.subject.create({
            data: { ...dto, organizationId: orgId },
        });
    }
    async findAll(orgId, paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = { organizationId: orgId };
        if (search)
            where.name = { contains: search };
        const [data, total] = await Promise.all([
            this.prisma.subject.findMany({
                where,
                skip,
                take: limit,
                include: { gradeSubjects: { include: { grade: true, teacher: true } } },
                orderBy: { name: 'asc' },
            }),
            this.prisma.subject.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(orgId, id) {
        const subject = await this.prisma.subject.findFirst({
            where: { id, organizationId: orgId },
            include: { gradeSubjects: { include: { grade: true, teacher: true } } },
        });
        if (!subject)
            throw new common_1.NotFoundException('المادة غير موجودة');
        return subject;
    }
    async update(orgId, id, dto) {
        await this.findOne(orgId, id);
        return this.prisma.subject.update({ where: { id }, data: dto });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.subject.delete({ where: { id } });
        return { message: 'تم حذف المادة بنجاح' };
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map