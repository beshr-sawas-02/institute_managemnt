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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let StudentsService = class StudentsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(orgId, createStudentDto) {
        await this.validateRelations(orgId, createStudentDto);
        const data = { ...createStudentDto, organizationId: orgId };
        if (data.dateOfBirth)
            data.dateOfBirth = new Date(data.dateOfBirth);
        const student = await this.prisma.student.create({
            data,
            include: {
                parent: { select: { id: true, firstName: true, lastName: true } },
                section: { include: { grade: true } },
            },
        });
        if (student.parentId) {
            await this.notificationsService.notifyStudentRegistered(student.id);
        }
        return student;
    }
    async findAll(orgId, paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = { organizationId: orgId };
        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.student.findMany({
                where,
                skip,
                take: limit,
                include: {
                    parent: {
                        select: { id: true, firstName: true, lastName: true, phone: true },
                    },
                    section: { include: { grade: true } },
                    user: { select: { id: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.student.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(orgId, id) {
        const student = await this.prisma.student.findFirst({
            where: { id, organizationId: orgId },
            include: {
                parent: true,
                section: { include: { grade: true } },
                user: { select: { id: true, email: true } },
                attendances: { take: 10, orderBy: { date: 'desc' } },
                assessments: {
                    take: 10,
                    orderBy: { assessmentDate: 'desc' },
                    include: { gradeSubject: { include: { subject: true } } },
                },
                payments: { orderBy: { dueDate: 'desc' } },
            },
        });
        if (!student)
            throw new common_1.NotFoundException('الطالب غير موجود');
        return student;
    }
    async findBySection(orgId, sectionId) {
        return this.prisma.student.findMany({
            where: { sectionId, organizationId: orgId, status: 'active' },
            include: {
                parent: {
                    select: { id: true, firstName: true, lastName: true, phone: true },
                },
            },
            orderBy: { firstName: 'asc' },
        });
    }
    async findByParent(orgId, parentId) {
        return this.prisma.student.findMany({
            where: { parentId, organizationId: orgId },
            include: { section: { include: { grade: true } } },
        });
    }
    async update(orgId, id, updateStudentDto) {
        await this.findOne(orgId, id);
        await this.validateRelations(orgId, updateStudentDto);
        const data = { ...updateStudentDto };
        if (data.dateOfBirth)
            data.dateOfBirth = new Date(data.dateOfBirth);
        return this.prisma.student.update({
            where: { id },
            data,
            include: {
                parent: { select: { id: true, firstName: true, lastName: true } },
                section: { include: { grade: true } },
            },
        });
    }
    async validateRelations(orgId, dto) {
        const checks = [];
        if (dto.userId !== undefined) {
            checks.push(this.prisma.user.findFirst({
                where: { id: dto.userId, organizationId: orgId },
                select: { id: true },
            }));
        }
        if (dto.parentId !== undefined) {
            checks.push(this.prisma.parent.findFirst({
                where: { id: dto.parentId, organizationId: orgId },
                select: { id: true },
            }));
        }
        if (dto.sectionId !== undefined) {
            checks.push(this.prisma.section.findFirst({
                where: { id: dto.sectionId, organizationId: orgId },
                select: { id: true },
            }));
        }
        const results = await Promise.all(checks);
        if (results.some((result) => !result)) {
            throw new common_1.NotFoundException('إحدى البيانات المرتبطة لا تتبع هذه المؤسسة');
        }
    }
    async remove(orgId, id) {
        await this.findOne(orgId, id);
        await this.prisma.student.delete({ where: { id } });
        return { message: 'تم حذف الطالب بنجاح' };
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], StudentsService);
//# sourceMappingURL=students.service.js.map