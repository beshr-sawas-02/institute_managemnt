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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let TeachersService = class TeachersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTeacherDto) {
        const data = { ...createTeacherDto };
        if (data.hireDate) {
            data.hireDate = new Date(data.hireDate);
        }
        return this.prisma.teacher.create({
            data,
            include: { user: { select: { id: true, email: true } } },
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
                    { specialization: { contains: search } },
                ],
            }
            : {};
        const [data, total] = await Promise.all([
            this.prisma.teacher.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, email: true } },
                    gradeSubjects: {
                        include: {
                            grade: true,
                            subject: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.teacher.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id) {
        const teacher = await this.prisma.teacher.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true } },
                gradeSubjects: {
                    include: {
                        grade: true,
                        subject: true,
                        schedules: {
                            include: { section: true },
                        },
                    },
                },
            },
        });
        if (!teacher) {
            throw new common_1.NotFoundException('المعلم غير موجود');
        }
        return teacher;
    }
    async update(id, updateTeacherDto) {
        await this.findOne(id);
        const data = { ...updateTeacherDto };
        if (data.hireDate) {
            data.hireDate = new Date(data.hireDate);
        }
        return this.prisma.teacher.update({
            where: { id },
            data,
            include: { user: { select: { id: true, email: true } } },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.teacher.delete({ where: { id } });
        return { message: 'تم حذف المعلم بنجاح' };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map