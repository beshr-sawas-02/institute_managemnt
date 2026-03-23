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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_service_1 = require("./attendance.service");
const attendance_dto_1 = require("./dto/attendance.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
const decorators_1 = require("../common/decorators");
const guards_1 = require("../common/guards");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    create(dto) {
        return this.attendanceService.create(dto);
    }
    bulkCreate(dto) {
        return this.attendanceService.bulkCreate(dto);
    }
    smartBulkCreate(dto) {
        return this.attendanceService.smartBulkCreate(dto);
    }
    getSectionSheet(sectionId, date) {
        return this.attendanceService.getSectionAttendanceSheet(sectionId, date);
    }
    findAll(date, sectionId) {
        return this.attendanceService.findAll({
            date,
            sectionId: sectionId ? parseInt(sectionId) : undefined,
        });
    }
    findBySection(sectionId, date) {
        return this.attendanceService.findBySection(sectionId, date);
    }
    findByStudent(studentId, dateFrom, dateTo) {
        return this.attendanceService.findByStudent(studentId, dateFrom, dateTo);
    }
    getStats(studentId, dateFrom, dateTo) {
        return this.attendanceService.getStats(studentId, dateFrom, dateTo);
    }
    findOne(id) {
        return this.attendanceService.findOne(id);
    }
    update(id, dto) {
        return this.attendanceService.update(id, dto);
    }
    remove(id) {
        return this.attendanceService.remove(id);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({ summary: 'تسجيل حضور طالب واحد' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.CreateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({ summary: 'تسجيل حضور جماعي يدوي' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.BulkAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Post)('smart-bulk'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({
        summary: 'تسجيل حضور ذكي - الكل حضور ما عدا الاستثناءات',
        description: 'يسجل حضور لكل طلاب الشعبة تلقائياً، فقط الغائبين والمتأخرين يُذكرون في exceptions',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_dto_1.SmartBulkAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "smartBulkCreate", null);
__decorate([
    (0, common_1.Get)('section/:sectionId/sheet'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({
        summary: 'كشف حضور الشعبة ليوم معين',
        description: 'يجيب قائمة الطلاب مرتبين أبجدياً مع حالة حضورهم - null إذا لم يُسجَّل بعد',
    }),
    (0, swagger_1.ApiQuery)({ name: 'date', example: '2025-09-14' }),
    __param(0, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getSectionSheet", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({ summary: 'جلب سجلات الحضور مع فلترة' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('section/:sectionId'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({ summary: 'حضور شعبة في يوم معين' }),
    (0, swagger_1.ApiQuery)({ name: 'date', example: '2025-09-14' }),
    __param(0, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findBySection", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher, client_1.UserRole.parent),
    (0, swagger_1.ApiOperation)({ summary: 'سجل حضور طالب معين' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('stats/:studentId'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher, client_1.UserRole.parent),
    (0, swagger_1.ApiOperation)({ summary: 'إحصائيات حضور طالب' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({ summary: 'تفاصيل سجل حضور' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({ summary: 'تعديل سجل حضور' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'حذف سجل حضور' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "remove", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('الحضور'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map