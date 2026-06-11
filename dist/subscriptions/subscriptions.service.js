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
    async create(dto) {
        const startDate = this.parseDate(dto.startDate);
        const endDate = this.parseDate(dto.endDate);
        this.validateNewDates(startDate, endDate);
        return this.prisma.$transaction(async (tx) => {
            const subscription = await tx.subscription.create({
                data: {
                    ...dto,
                    startDate,
                    endDate,
                    status: 'active',
                },
                include: { organization: true },
            });
            await tx.organization.update({
                where: { id: dto.organizationId },
                data: { isActive: true },
            });
            return subscription;
        });
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { plan: { contains: search, mode: 'insensitive' } },
                    { organization: { name: { contains: search, mode: 'insensitive' } } },
                    { organization: { nameAr: { contains: search, mode: 'insensitive' } } },
                    { organization: { nameEn: { contains: search, mode: 'insensitive' } } },
                ],
            }
            : {};
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
        if (!subscription) {
            throw new common_1.NotFoundException('الاشتراك غير موجود');
        }
        return subscription;
    }
    async update(id, dto) {
        const current = await this.findOne(id);
        const data = {
            ...(dto.plan !== undefined ? { plan: dto.plan } : {}),
            ...(dto.price !== undefined ? { price: dto.price } : {}),
        };
        if (dto.startDate || dto.endDate) {
            const startDate = dto.startDate
                ? this.parseDate(dto.startDate)
                : new Date(current.startDate);
            const endDate = dto.endDate
                ? this.parseDate(dto.endDate)
                : new Date(current.endDate);
            const startDateChanged = dto.startDate !== undefined &&
                startDate.getTime() !== new Date(current.startDate).getTime();
            if (startDateChanged)
                this.validateNewDates(startDate, endDate);
            if (endDate < startDate) {
                throw new common_1.BadRequestException('تاريخ نهاية الاشتراك يجب أن يكون بعد تاريخ البداية');
            }
            if (dto.startDate)
                data.startDate = startDate;
            if (dto.endDate)
                data.endDate = endDate;
        }
        return this.prisma.subscription.update({
            where: { id },
            data,
            include: { organization: true },
        });
    }
    async extend(id, dto) {
        const current = await this.findOne(id);
        const endDate = this.parseDate(dto.endDate);
        const minimumDate = new Date(Math.max(this.today().getTime(), new Date(current.endDate).getTime()));
        if (endDate < minimumDate) {
            throw new common_1.BadRequestException('تاريخ نهاية الاشتراك لا يمكن أن يكون قديمًا');
        }
        return this.setStatusAndSyncOrganization(id, 'active', { endDate });
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        return this.setStatusAndSyncOrganization(id, dto.status);
    }
    async pause(id) {
        await this.findOne(id);
        return this.setStatusAndSyncOrganization(id, 'paused');
    }
    async remove(id) {
        const subscription = await this.findOne(id);
        await this.prisma.$transaction(async (tx) => {
            await tx.subscription.delete({ where: { id } });
            await this.syncOrganizationStatus(tx, subscription.organizationId);
        });
        return { message: 'تم حذف الاشتراك بنجاح' };
    }
    parseDate(value) {
        return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
    }
    today() {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    }
    validateNewDates(startDate, endDate) {
        if (startDate < this.today()) {
            throw new common_1.BadRequestException('تاريخ بداية الاشتراك لا يمكن أن يكون قبل اليوم');
        }
        if (endDate < startDate) {
            throw new common_1.BadRequestException('تاريخ نهاية الاشتراك يجب أن يكون بعد تاريخ البداية');
        }
    }
    async setStatusAndSyncOrganization(id, status, extraData = {}) {
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.subscription.update({
                where: { id },
                data: { ...extraData, status },
                include: { organization: true },
            });
            await this.syncOrganizationStatus(tx, updated.organizationId);
            return updated;
        });
    }
    async syncOrganizationStatus(tx, organizationId) {
        const activeSubscription = await tx.subscription.findFirst({
            where: { organizationId, status: 'active' },
            select: { id: true },
        });
        await tx.organization.update({
            where: { id: organizationId },
            data: { isActive: Boolean(activeSubscription) },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map