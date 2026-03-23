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
exports.GradeSubjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GradeSubjectsService = class GradeSubjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.gradeSubject.findFirst({
            where: { gradeId: dto.gradeId, subjectId: dto.subjectId, sectionId: dto.sectionId },
        });
        if (existing)
            throw new common_1.ConflictException('هذه المادة مربوطة بالصف بالفعل');
        return this.prisma.gradeSubject.create({
            data: dto,
            include: { grade: true, subject: true, teacher: true },
        });
    }
    async findAll() {
        return this.prisma.gradeSubject.findMany({
            include: { grade: true, subject: true, teacher: true },
            orderBy: { gradeId: 'asc' },
        });
    }
    async findByGrade(gradeId) {
        return this.prisma.gradeSubject.findMany({
            where: { gradeId },
            include: { subject: true, teacher: true },
        });
    }
    async findByTeacher(teacherId) {
        return this.prisma.gradeSubject.findMany({
            where: { teacherId },
            include: { grade: true, subject: true },
        });
    }
    async findOne(id) {
        const gs = await this.prisma.gradeSubject.findUnique({
            where: { id },
            include: { grade: true, subject: true, teacher: true, schedules: true },
        });
        if (!gs)
            throw new common_1.NotFoundException('مادة الصف غير موجودة');
        return gs;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.gradeSubject.update({
            where: { id },
            data: dto,
            include: { grade: true, subject: true, teacher: true },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.gradeSubject.delete({ where: { id } });
        return { message: 'تم حذف ربط المادة بالصف بنجاح' };
    }
};
exports.GradeSubjectsService = GradeSubjectsService;
exports.GradeSubjectsService = GradeSubjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradeSubjectsService);
//# sourceMappingURL=grade-subjects.service.js.map