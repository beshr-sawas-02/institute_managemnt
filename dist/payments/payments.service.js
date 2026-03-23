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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const tuition_fees_service_1 = require("../tuition-fees/tuition-fees.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let PaymentsService = class PaymentsService {
    constructor(prisma, notificationsService, tuitionFeesService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.tuitionFeesService = tuitionFeesService;
    }
    async create(dto) {
        const discount = dto.discount || 0;
        const finalAmount = dto.amount - discount;
        const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const payment = await this.prisma.payment.create({
            data: {
                ...dto,
                discount,
                finalAmount,
                receiptNumber,
                dueDate: new Date(dto.dueDate),
                paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : null,
            },
            include: {
                student: { include: { parent: { include: { user: true } } } },
            },
        });
        if (payment.student?.parent?.userId) {
            const balance = await this.tuitionFeesService.getStudentBalance(dto.studentId, dto.academicYear);
            await this.notificationsService.notifyNewPaymentWithBalance(dto.studentId, finalAmount, dto.dueDate, payment.id, balance);
        }
        return payment;
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { receiptNumber: { contains: search } },
                    { student: { firstName: { contains: search } } },
                    { student: { lastName: { contains: search } } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                include: {
                    student: { select: { id: true, firstName: true, lastName: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.payment.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findByStudent(studentId, academicYear) {
        const payments = await this.prisma.payment.findMany({
            where: { studentId, ...(academicYear ? { academicYear } : {}) },
            orderBy: { dueDate: 'desc' },
        });
        if (academicYear) {
            const balance = await this.tuitionFeesService.getStudentBalance(studentId, academicYear);
            return { payments, balance: balance ?? null };
        }
        return { payments, balance: null };
    }
    async getStats(academicYear) {
        const where = academicYear ? { academicYear } : {};
        const [totalPaid, totalPending, totalPartial] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { ...where, status: 'paid' },
                _sum: { finalAmount: true },
            }),
            this.prisma.payment.aggregate({
                where: { ...where, status: 'pending' },
                _sum: { finalAmount: true },
            }),
            this.prisma.payment.aggregate({
                where: { ...where, status: 'partial' },
                _sum: { finalAmount: true },
            }),
        ]);
        return {
            totalPaid: totalPaid._sum.finalAmount || 0,
            totalPending: totalPending._sum.finalAmount || 0,
            totalPartial: totalPartial._sum.finalAmount || 0,
        };
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { student: { include: { parent: true } } },
        });
        if (!payment)
            throw new common_1.NotFoundException('الدفعة غير موجودة');
        return payment;
    }
    async update(id, dto) {
        const current = await this.findOne(id);
        const data = { ...dto };
        if (dto.dueDate)
            data.dueDate = new Date(dto.dueDate);
        if (dto.paymentDate)
            data.paymentDate = new Date(dto.paymentDate);
        if (dto.amount !== undefined || dto.discount !== undefined) {
            const amount = dto.amount ?? Number(current.amount);
            const discount = dto.discount ?? Number(current.discount);
            data.finalAmount = amount - discount;
        }
        const updated = await this.prisma.payment.update({
            where: { id },
            data,
            include: {
                student: { include: { parent: { include: { user: true } } } },
            },
        });
        if (dto.status === 'paid' && current.status !== 'paid') {
            if (updated.student?.parent?.userId) {
                const balance = await this.tuitionFeesService.getStudentBalance(updated.studentId, updated.academicYear);
                await this.notificationsService.notifyPaymentConfirmedWithBalance(updated.studentId, Number(updated.finalAmount), updated.receiptNumber || '', updated.id, balance);
            }
        }
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.payment.delete({ where: { id } });
        return { message: 'تم حذف الدفعة بنجاح' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        tuition_fees_service_1.TuitionFeesService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map