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
exports.TuitionFeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TuitionFeesService = class TuitionFeesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const existing = await this.prisma.tuitionFee.findFirst({
            where: { gradeId: dto.gradeId, academicYear: dto.academicYear },
        });
        if (existing) {
            throw new common_1.ConflictException('يوجد قسط مسجل لهذا الصف في هذه السنة الدراسية بالفعل');
        }
        return this.prisma.tuitionFee.create({
            data: {
                ...dto,
                createdBy: userId,
            },
            include: {
                grade: { select: { id: true, name: true, level: true } },
                creator: { select: { id: true, email: true } },
            },
        });
    }
    async findAll(academicYear) {
        const where = academicYear ? { academicYear } : {};
        return this.prisma.tuitionFee.findMany({
            where,
            include: {
                grade: { select: { id: true, name: true, level: true } },
                creator: { select: { id: true, email: true } },
            },
            orderBy: [{ academicYear: 'desc' }, { gradeId: 'asc' }],
        });
    }
    async findOne(id) {
        const fee = await this.prisma.tuitionFee.findUnique({
            where: { id },
            include: {
                grade: { select: { id: true, name: true, level: true } },
                creator: { select: { id: true, email: true } },
            },
        });
        if (!fee)
            throw new common_1.NotFoundException('القسط غير موجود');
        return fee;
    }
    async findByGrade(gradeId, academicYear) {
        const fee = await this.prisma.tuitionFee.findFirst({
            where: { gradeId, academicYear },
            include: {
                grade: { select: { id: true, name: true, level: true } },
            },
        });
        if (!fee)
            throw new common_1.NotFoundException('لم يتم تحديد قسط لهذا الصف في هذه السنة الدراسية');
        return fee;
    }
    async update(id, dto) {
        const current = await this.findOne(id);
        if (dto.gradeId || dto.academicYear) {
            const gradeId = dto.gradeId ?? current.grade.id;
            const academicYear = dto.academicYear ?? current.academicYear;
            const conflict = await this.prisma.tuitionFee.findFirst({
                where: { gradeId, academicYear, id: { not: id } },
            });
            if (conflict) {
                throw new common_1.ConflictException('يوجد قسط مسجل لهذا الصف في هذه السنة الدراسية بالفعل');
            }
        }
        return this.prisma.tuitionFee.update({
            where: { id },
            data: dto,
            include: {
                grade: { select: { id: true, name: true, level: true } },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.tuitionFee.delete({ where: { id } });
        return { message: 'تم حذف القسط بنجاح' };
    }
    async getStudentBalance(studentId, academicYear) {
        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: {
                section: {
                    include: { grade: true },
                },
            },
        });
        if (!student?.section?.gradeId)
            return null;
        const tuitionFee = await this.prisma.tuitionFee.findFirst({
            where: {
                gradeId: student.section.gradeId,
                academicYear,
            },
        });
        if (!tuitionFee)
            return null;
        const paidAggregate = await this.prisma.payment.aggregate({
            where: {
                studentId,
                status: 'paid',
            },
            _sum: { finalAmount: true },
        });
        const annualAmount = Number(tuitionFee.annualAmount);
        const totalPaid = Number(paidAggregate._sum.finalAmount) || 0;
        const remaining = annualAmount - totalPaid;
        return {
            annualAmount,
            totalPaid,
            remaining,
            gradeName: student.section.grade.name,
        };
    }
};
exports.TuitionFeesService = TuitionFeesService;
exports.TuitionFeesService = TuitionFeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TuitionFeesService);
//# sourceMappingURL=tuition-fees.service.js.map