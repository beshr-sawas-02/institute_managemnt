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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const schedules_service_1 = require("./schedules.service");
const schedule_dto_1 = require("./dto/schedule.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let SchedulesController = class SchedulesController {
    constructor(service) {
        this.service = service;
    }
    create(orgId, dto) {
        return this.service.create(orgId, dto);
    }
    findAll(orgId) {
        return this.service.findAll(orgId);
    }
    findBySection(orgId, sectionId) {
        return this.service.findBySection(orgId, sectionId);
    }
    findByTeacher(orgId, teacherId) {
        return this.service.findByTeacher(orgId, teacherId);
    }
    findOne(orgId, id) {
        return this.service.findOne(orgId, id);
    }
    update(orgId, id, dto) {
        return this.service.update(orgId, id, dto);
    }
    remove(orgId, id) {
        return this.service.remove(orgId, id);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'إضافة حصة جديدة' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'جلب جميع الحصص' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('section/:sectionId'),
    (0, swagger_1.ApiOperation)({ summary: 'جلب جدول شعبة' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "findBySection", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    (0, swagger_1.ApiOperation)({ summary: 'جلب جدول معلم' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('teacherId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "findByTeacher", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'جلب حصة بالمعرف' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث حصة' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'حذف حصة' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "remove", null);
exports.SchedulesController = SchedulesController = __decorate([
    (0, swagger_1.ApiTags)('الجداول الزمنية'),
    (0, common_1.Controller)('schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [schedules_service_1.SchedulesService])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map