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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getOrgStats(orgId) {
        return this.dashboardService.getOrgStats(orgId);
    }
    getPlatformStats() {
        return this.dashboardService.getPlatformStats();
    }
    getFinancialSummary(orgId, month, year) {
        return this.dashboardService.getFinancialSummary(orgId, month, year);
    }
    getAttendanceSummary(orgId, dateFrom, dateTo) {
        return this.dashboardService.getAttendanceSummary(orgId, dateFrom, dateTo);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('org'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiOperation)({ summary: 'Org dashboard — students, attendance, finance' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Org stats' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getOrgStats", null);
__decorate([
    (0, common_1.Get)('platform'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Platform dashboard — orgs, subscriptions, revenue',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Platform stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getPlatformStats", null);
__decorate([
    (0, common_1.Get)('financial'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiOperation)({ summary: 'Monthly financial summary' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Income, expenses, net for the month' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getFinancialSummary", null);
__decorate([
    (0, common_1.Get)('attendance'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiOperation)({ summary: 'Attendance summary with top absentees' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Attendance breakdown' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Query)('dateFrom')),
    __param(2, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getAttendanceSummary", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('لوحة التحكم'),
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map