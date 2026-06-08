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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const reports_service_1 = require("./reports.service");
const monthly_report_service_1 = require("./monthly-report.service");
const report_dto_1 = require("./dto/report.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let ReportsController = class ReportsController {
    constructor(service, monthlyReportService) {
        this.service = service;
        this.monthlyReportService = monthlyReportService;
    }
    create(orgId, userId, dto) {
        return this.service.create(orgId, userId, dto);
    }
    getStudentMonthlyReport(studentId, month, year) {
        return this.monthlyReportService.generateStudentMonthlyReport(studentId, Number(month), Number(year));
    }
    getSectionMonthlyReport(sectionId, month, year) {
        return this.monthlyReportService.generateSectionMonthlyReports(sectionId, Number(month), Number(year));
    }
    generateAndNotifySectionReports(orgId, userId, sectionId, month, year) {
        return this.monthlyReportService.generateAndNotifySectionReports(orgId, sectionId, Number(month), Number(year), userId);
    }
    generateAndNotifyAllSections(orgId, userId, month, year) {
        return this.monthlyReportService.generateAndNotifyAllSections(orgId, Number(month), Number(year), userId);
    }
    findAll(orgId, p) {
        return this.service.findAll(orgId, p);
    }
    findOne(orgId, id) {
        return this.service.findOne(orgId, id);
    }
    remove(orgId, id) {
        return this.service.remove(orgId, id);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء تقرير جديد' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, report_dto_1.CreateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('monthly/student/:studentId'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.parent),
    (0, swagger_1.ApiOperation)({ summary: 'تقرير شهري لطالب واحد' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getStudentMonthlyReport", null);
__decorate([
    (0, common_1.Get)('monthly/section/:sectionId'),
    (0, swagger_1.ApiOperation)({ summary: 'تقرير شهري لشعبة كاملة' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    __param(0, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSectionMonthlyReport", null);
__decorate([
    (0, common_1.Post)('monthly/section/:sectionId/notify'),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء تقرير شهري لشعبة وإرسال إشعارات' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __param(2, (0, common_1.Param)('sectionId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('month')),
    __param(4, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateAndNotifySectionReports", null);
__decorate([
    (0, common_1.Post)('monthly/all/notify'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'إنشاء تقارير شهرية لجميع الشعب' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: true }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "generateAndNotifyAllSections", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'جلب جميع التقارير' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'جلب تقرير بالمعرف' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'حذف تقرير' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "remove", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('التقارير'),
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        monthly_report_service_1.MonthlyReportService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map