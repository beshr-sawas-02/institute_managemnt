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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const notification_localization_1 = require("../notifications/notification-localization");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let AssessmentsService = class AssessmentsService {
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(dto) {
        let percentage = null;
        let grade = null;
        if (dto.score !== undefined && dto.score !== null) {
            percentage = (dto.score / dto.maxScore) * 100;
            grade = this.calculateGrade(percentage);
        }
        const assessment = await this.prisma.assessment.create({
            data: {
                ...dto,
                assessmentDate: new Date(dto.assessmentDate),
                percentage,
                grade,
            },
            include: {
                student: { include: { parent: { include: { user: true } } } },
                gradeSubject: { include: { subject: true, teacher: true } },
            },
        });
        if (assessment.student?.parent?.user) {
            const subjectName = assessment.gradeSubject?.subject?.name || 'غير محدد';
            const studentName = `${assessment.student.firstName} ${assessment.student.lastName}`;
            const teacherName = assessment.gradeSubject?.teacher
                ? `${assessment.gradeSubject.teacher.firstName} ${assessment.gradeSubject.teacher.lastName}`
                : undefined;
            const content = dto.score !== undefined && dto.score !== null && percentage !== null
                ? (0, notification_localization_1.buildAssessmentResultNotification)({
                    studentName,
                    subjectName,
                    assessmentType: dto.type,
                    assessmentTitle: dto.title,
                    maxScore: dto.maxScore,
                    score: dto.score,
                    percentage,
                    grade,
                    teacherName,
                    feedback: dto.feedback,
                })
                : (0, notification_localization_1.buildAssessmentCreatedNotification)({
                    studentName,
                    subjectName,
                    assessmentType: dto.type,
                    assessmentTitle: dto.title,
                    maxScore: dto.maxScore,
                    teacherName,
                });
            await this.notificationsService.createLocalizedNotification({
                userId: assessment.student.parent.user.id,
                preferredLanguage: assessment.student.parent.user.preferredLanguage,
                relatedId: assessment.id,
                relatedType: 'assessment',
                type: dto.score !== undefined && dto.score !== null && percentage !== null
                    ? (percentage >= 50 ? 'success' : 'warning')
                    : 'info',
                channel: 'push',
                content,
            });
        }
        return assessment;
    }
    async findAll(paginationDto) {
        const { page, limit, sectionId, gradeSubjectId } = paginationDto;
        const skip = (page - 1) * limit;
        const where = {};
        if (sectionId) {
            where.student = { sectionId };
        }
        if (gradeSubjectId) {
            where.gradeSubjectId = gradeSubjectId;
        }
        const [data, total] = await Promise.all([
            this.prisma.assessment.findMany({
                skip,
                take: limit,
                where,
                include: {
                    student: { select: { id: true, firstName: true, lastName: true } },
                    gradeSubject: { include: { subject: true, grade: true } },
                },
                orderBy: { assessmentDate: 'desc' },
            }),
            this.prisma.assessment.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findByStudent(studentId) {
        return this.prisma.assessment.findMany({
            where: { studentId },
            include: { gradeSubject: { include: { subject: true } } },
            orderBy: { assessmentDate: 'desc' },
        });
    }
    async findOne(id) {
        const assessment = await this.prisma.assessment.findUnique({
            where: { id },
            include: {
                student: true,
                gradeSubject: { include: { subject: true, grade: true, teacher: true } },
            },
        });
        if (!assessment) {
            throw new common_1.NotFoundException('التقييم غير موجود');
        }
        return assessment;
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const data = { ...dto };
        if (dto.assessmentDate) {
            data.assessmentDate = new Date(dto.assessmentDate);
        }
        let newPercentage = null;
        let newGrade = null;
        if (dto.score !== undefined && dto.maxScore) {
            newPercentage = (dto.score / dto.maxScore) * 100;
            newGrade = this.calculateGrade(newPercentage);
            data.percentage = newPercentage;
            data.grade = newGrade;
        }
        else if (dto.score !== undefined && existing.maxScore) {
            newPercentage = (dto.score / Number(existing.maxScore)) * 100;
            newGrade = this.calculateGrade(newPercentage);
            data.percentage = newPercentage;
            data.grade = newGrade;
        }
        const updated = await this.prisma.assessment.update({
            where: { id },
            data,
            include: {
                student: { include: { parent: { include: { user: true } } } },
                gradeSubject: { include: { subject: true, teacher: true } },
            },
        });
        if (dto.score !== undefined &&
            dto.score !== null &&
            Number(existing.score) !== dto.score &&
            updated.student?.parent?.user &&
            newPercentage !== null) {
            const subjectName = updated.gradeSubject?.subject?.name || 'غير محدد';
            const studentName = `${updated.student.firstName} ${updated.student.lastName}`;
            const wasUnscored = existing.score === null;
            const content = (0, notification_localization_1.buildAssessmentScoreUpdatedNotification)({
                studentName,
                subjectName,
                assessmentType: updated.type,
                assessmentTitle: updated.title,
                maxScore: Number(updated.maxScore),
                score: dto.score,
                percentage: newPercentage,
                grade: newGrade || updated.grade,
                wasUnscored,
            });
            await this.notificationsService.createLocalizedNotification({
                userId: updated.student.parent.user.id,
                preferredLanguage: updated.student.parent.user.preferredLanguage,
                relatedId: updated.id,
                relatedType: 'assessment',
                type: newPercentage >= 50 ? 'success' : 'warning',
                channel: 'push',
                content,
            });
        }
        return updated;
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.assessment.delete({ where: { id } });
        return { message: 'تم حذف التقييم بنجاح' };
    }
    calculateGrade(percentage) {
        if (percentage >= 90)
            return 'ممتاز';
        if (percentage >= 80)
            return 'جيد جداً';
        if (percentage >= 70)
            return 'جيد';
        if (percentage >= 60)
            return 'مقبول';
        if (percentage >= 50)
            return 'ضعيف';
        return 'راسب';
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map