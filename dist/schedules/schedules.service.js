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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SchedulesService = class SchedulesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const startTime = new Date(`1970-01-01T${dto.startTime}:00`);
        const endTime = new Date(`1970-01-01T${dto.endTime}:00`);
        const sectionConflict = await this.prisma.schedule.findFirst({
            where: {
                sectionId: dto.sectionId,
                dayOfWeek: dto.dayOfWeek,
                status: 'scheduled',
                AND: [
                    { startTime: { lt: endTime } },
                    { endTime: { gt: startTime } },
                ],
            },
        });
        if (sectionConflict) {
            throw new common_1.BadRequestException('يوجد تضارب في الجدول الزمني لهذه الشعبة في هذا الوقت');
        }
        const gradeSubject = await this.prisma.gradeSubject.findUnique({
            where: { id: dto.gradeSubjectId },
            select: { teacherId: true },
        });
        if (gradeSubject?.teacherId) {
            const teacherConflict = await this.prisma.schedule.findFirst({
                where: {
                    dayOfWeek: dto.dayOfWeek,
                    status: 'scheduled',
                    gradeSubject: { teacherId: gradeSubject.teacherId },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } },
                    ],
                },
            });
            if (teacherConflict) {
                throw new common_1.BadRequestException('المعلم لديه حصة أخرى تتداخل مع هذا الوقت');
            }
        }
        return this.prisma.schedule.create({
            data: {
                ...dto,
                startTime,
                endTime,
            },
            include: {
                section: { include: { grade: true } },
                gradeSubject: { include: { subject: true, teacher: true } },
            },
        });
    }
    async findAll() {
        return this.prisma.schedule.findMany({
            include: {
                section: { include: { grade: true } },
                gradeSubject: { include: { subject: true, teacher: true } },
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
    }
    async findBySection(sectionId) {
        return this.prisma.schedule.findMany({
            where: { sectionId, status: 'scheduled' },
            include: {
                gradeSubject: { include: { subject: true, teacher: true } },
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
    }
    async findByTeacher(teacherId) {
        return this.prisma.schedule.findMany({
            where: {
                gradeSubject: { teacherId },
                status: 'scheduled',
            },
            include: {
                section: { include: { grade: true } },
                gradeSubject: { include: { subject: true } },
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        });
    }
    async findOne(id) {
        const schedule = await this.prisma.schedule.findUnique({
            where: { id },
            include: {
                section: { include: { grade: true } },
                gradeSubject: { include: { subject: true, teacher: true } },
            },
        });
        if (!schedule)
            throw new common_1.NotFoundException('الحصة غير موجودة');
        return schedule;
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const newStartTime = dto.startTime
            ? new Date(`1970-01-01T${dto.startTime}:00`)
            : existing.startTime;
        const newEndTime = dto.endTime
            ? new Date(`1970-01-01T${dto.endTime}:00`)
            : existing.endTime;
        const newDayOfWeek = dto.dayOfWeek || existing.dayOfWeek;
        const newGradeSubjectId = dto.gradeSubjectId || existing.gradeSubjectId;
        const newSectionId = dto.sectionId || existing.sectionId;
        const sectionConflict = await this.prisma.schedule.findFirst({
            where: {
                id: { not: id },
                sectionId: newSectionId,
                dayOfWeek: newDayOfWeek,
                status: 'scheduled',
                AND: [
                    { startTime: { lt: newEndTime } },
                    { endTime: { gt: newStartTime } },
                ],
            },
        });
        if (sectionConflict) {
            throw new common_1.BadRequestException('يوجد تضارب في الجدول الزمني لهذه الشعبة في هذا الوقت');
        }
        const gradeSubject = await this.prisma.gradeSubject.findUnique({
            where: { id: newGradeSubjectId },
            select: { teacherId: true },
        });
        if (gradeSubject?.teacherId) {
            const teacherConflict = await this.prisma.schedule.findFirst({
                where: {
                    id: { not: id },
                    dayOfWeek: newDayOfWeek,
                    status: 'scheduled',
                    gradeSubject: { teacherId: gradeSubject.teacherId },
                    AND: [
                        { startTime: { lt: newEndTime } },
                        { endTime: { gt: newStartTime } },
                    ],
                },
            });
            if (teacherConflict) {
                throw new common_1.BadRequestException('المعلم لديه حصة أخرى تتداخل مع هذا الوقت');
            }
        }
        const data = { ...dto };
        if (dto.startTime)
            data.startTime = newStartTime;
        if (dto.endTime)
            data.endTime = newEndTime;
        return this.prisma.schedule.update({
            where: { id },
            data,
            include: {
                section: { include: { grade: true } },
                gradeSubject: { include: { subject: true, teacher: true } },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.schedule.delete({ where: { id } });
        return { message: 'تم حذف الحصة بنجاح' };
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map