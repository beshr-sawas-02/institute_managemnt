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
exports.ReceptionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let ReceptionService = class ReceptionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createReceptionDto) {
        return this.prisma.reception.create({
            data: createReceptionDto,
            include: { user: { select: { id: true, email: true, role: true } } },
        });
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { firstName: { contains: search } },
                    { lastName: { contains: search } },
                    { phone: { contains: search } },
                    { email: { contains: search } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            this.prisma.reception.findMany({
                where,
                skip,
                take: limit,
                include: { user: { select: { id: true, email: true, role: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.reception.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id) {
        const reception = await this.prisma.reception.findUnique({
            where: { id },
            include: { user: { select: { id: true, email: true, role: true } } },
        });
        if (!reception) {
            throw new common_1.NotFoundException('Reception not found');
        }
        return reception;
    }
    async update(id, updateReceptionDto) {
        await this.findOne(id);
        return this.prisma.reception.update({
            where: { id },
            data: updateReceptionDto,
            include: { user: { select: { id: true, email: true, role: true } } },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.reception.delete({ where: { id } });
        return { message: 'Reception deleted successfully' };
    }
};
exports.ReceptionService = ReceptionService;
exports.ReceptionService = ReceptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReceptionService);
//# sourceMappingURL=reception.service.js.map