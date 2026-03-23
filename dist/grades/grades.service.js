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
exports.GradesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let GradesService = class GradesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createGradeDto) {
        return this.prisma.grade.create({ data: createGradeDto });
    }
    async findAll(paginationDto) {
        const { page, limit, search } = paginationDto;
        const skip = (page - 1) * limit;
        const where = search ? { name: { contains: search } } : {};
        const [data, total] = await Promise.all([
            this.prisma.grade.findMany({
                where,
                skip,
                take: limit,
                include: {
                    sections: { where: { status: 'active' } },
                    gradeSubjects: { include: { subject: true, teacher: true } },
                },
                orderBy: { name: 'asc' },
            }),
            this.prisma.grade.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id) {
        const grade = await this.prisma.grade.findUnique({
            where: { id },
            include: {
                sections: {
                    include: { students: { where: { status: 'active' } } },
                },
                gradeSubjects: {
                    include: { subject: true, teacher: true },
                },
            },
        });
        if (!grade)
            throw new common_1.NotFoundException('الصف غير موجود');
        return grade;
    }
    async update(id, updateGradeDto) {
        await this.findOne(id);
        return this.prisma.grade.update({
            where: { id },
            data: updateGradeDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.grade.delete({ where: { id } });
        return { message: 'تم حذف الصف بنجاح' };
    }
};
exports.GradesService = GradesService;
exports.GradesService = GradesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GradesService);
//# sourceMappingURL=grades.service.js.map