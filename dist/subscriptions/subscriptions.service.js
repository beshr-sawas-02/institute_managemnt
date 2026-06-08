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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSubscriptionDto) {
        return this.prisma.subscription.create({
            data: {
                ...createSubscriptionDto,
                price: createSubscriptionDto.price,
                startDate: new Date(createSubscriptionDto.startDate),
                endDate: new Date(createSubscriptionDto.endDate),
                status: 'active',
            },
            include: { organization: true },
        });
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.organization = { name: { contains: search } };
        }
        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                skip,
                take: limit,
                include: { organization: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id },
            include: { organization: true },
        });
        if (!subscription)
            throw new common_1.NotFoundException('الاشتراك غير موجود');
        return subscription;
    }
    async update(id, updateSubscriptionDto) {
        await this.findOne(id);
        const data = { ...updateSubscriptionDto };
        if (data.startDate)
            data.startDate = new Date(data.startDate);
        if (data.endDate)
            data.endDate = new Date(data.endDate);
        return this.prisma.subscription.update({
            where: { id },
            data,
            include: { organization: true },
        });
    }
    async extend(id, dto) {
        await this.findOne(id);
        return this.prisma.subscription.update({
            where: { id },
            data: {
                endDate: new Date(dto.endDate),
                status: 'active',
            },
            include: { organization: true },
        });
    }
    async pause(id) {
        await this.findOne(id);
        return this.prisma.subscription.update({
            where: { id },
            data: { status: 'paused' },
            include: { organization: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.subscription.delete({ where: { id } });
        return { message: 'تم حذف الاشتراك بنجاح' };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map