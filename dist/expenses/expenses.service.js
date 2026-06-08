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
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let ExpensesService = class ExpensesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAvailableBalance(orgId) {
        const [totalPaid, totalExpenses] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { status: 'paid', organizationId: orgId },
                _sum: { finalAmount: true },
            }),
            this.prisma.expense.aggregate({
                where: { organizationId: orgId },
                _sum: { amount: true },
            }),
        ]);
        const paid = Number(totalPaid._sum.finalAmount) || 0;
        const expenses = Number(totalExpenses._sum.amount) || 0;
        return paid - expenses;
    }
    async create(orgId, userId, dto) {
        const availableBalance = await this.getAvailableBalance(orgId);
        if (dto.amount > availableBalance) {
            throw new common_1.BadRequestException(`لا يمكن إضافة هذا المصروف. الرصيد المتاح: ${availableBalance.toFixed(2)}، والمبلغ المطلوب: ${dto.amount}`);
        }
        return this.prisma.expense.create({
            data: {
                ...dto,
                organizationId: orgId,
                createdBy: userId,
                expenseDate: new Date(dto.expenseDate),
            },
            include: { creator: { select: { id: true, email: true } } },
        });
    }
    async findAll(orgId, paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = { organizationId: orgId };
        if (search)
            where.description = { contains: search };
        const [data, total] = await Promise.all([
            this.prisma.expense.findMany({
                where,
                skip,
                take: limit,
                include: { creator: { select: { id: true, email: true } } },
                orderBy: { expenseDate: 'desc' },
            }),
            this.prisma.expense.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getStats(orgId, dateFrom, dateTo) {
        const where = { organizationId: orgId };
        if (dateFrom || dateTo) {
            where.expenseDate = {};
            if (dateFrom)
                where.expenseDate.gte = new Date(dateFrom);
            if (dateTo)
                where.expenseDate.lte = new Date(dateTo);
        }
        const byCategory = await this.prisma.expense.groupBy({
            by: ['category'],
            where,
            _sum: { amount: true },
            _count: true,
        });
        const total = await this.prisma.expense.aggregate({
            where,
            _sum: { amount: true },
        });
        const availableBalance = await this.getAvailableBalance(orgId);
        return {
            total: total._sum.amount || 0,
            byCategory,
            availableBalance,
        };
    }
    async findOne(orgId, id) {
        const expense = await this.prisma.expense.findFirst({
            where: { id, organizationId: orgId },
            include: { creator: { select: { id: true, email: true } } },
        });
        if (!expense)
            throw new common_1.NotFoundException('المصروف غير موجود');
        return expense;
    }
    async update(orgId, id, dto) {
        const existing = await this.findOne(orgId, id);
        if (dto.amount !== undefined && dto.amount !== Number(existing.amount)) {
            const availableBalance = await this.getAvailableBalance(orgId);
            const diff = dto.amount - Number(existing.amount);
            if (diff > availableBalance) {
                throw new common_1.BadRequestException(`لا يمكن تحديث هذا المصروف. الرصيد المتاح: ${availableBalance.toFixed(2)}`);
            }
        }
        const data = { ...dto };
        if (dto.expenseDate)
            data.expenseDate = new Date(dto.expenseDate);
        return this.prisma.expense.update({
            where: { id },
            data,
            include: { creator: { select: { id: true, email: true } } },
        });
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.expense.delete({ where: { id } });
        return { message: 'تم حذف المصروف بنجاح' };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map