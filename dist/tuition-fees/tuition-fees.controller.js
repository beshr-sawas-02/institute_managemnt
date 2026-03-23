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
exports.TuitionFeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const tuition_fees_service_1 = require("./tuition-fees.service");
const tuition_fee_dto_1 = require("./dto/tuition-fee.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let TuitionFeesController = class TuitionFeesController {
    constructor(service) {
        this.service = service;
    }
    create(userId, dto) {
        return this.service.create(userId, dto);
    }
    findAll(academicYear) {
        return this.service.findAll(academicYear);
    }
    findByGrade(gradeId, academicYear) {
        return this.service.findByGrade(gradeId, academicYear);
    }
    getStudentBalance(studentId, academicYear) {
        return this.service.getStudentBalance(studentId, academicYear);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.TuitionFeesController = TuitionFeesController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'تحديد قسط سنوي لصف' }),
    __param(0, (0, decorators_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, tuition_fee_dto_1.CreateTuitionFeeDto]),
    __metadata("design:returntype", void 0)
], TuitionFeesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiOperation)({ summary: 'جلب جميع أقساط الصفوف' }),
    (0, swagger_1.ApiQuery)({ name: 'academicYear', required: false, example: '2024-2025' }),
    __param(0, (0, common_1.Query)('academicYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TuitionFeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('grade/:gradeId'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiOperation)({ summary: 'جلب قسط صف معين لسنة دراسية' }),
    (0, swagger_1.ApiQuery)({ name: 'academicYear', required: true, example: '2024-2025' }),
    __param(0, (0, common_1.Param)('gradeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('academicYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], TuitionFeesController.prototype, "findByGrade", null);
__decorate([
    (0, common_1.Get)('student/:studentId/balance'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.parent),
    (0, swagger_1.ApiOperation)({
        summary: 'رصيد الطالب - القسط السنوي والمدفوع والمتبقي',
        description: 'يعرض القسط السنوي للصف، إجمالي المبلغ المدفوع، والمبلغ المتبقي للطالب في سنة دراسية معينة',
    }),
    (0, swagger_1.ApiQuery)({ name: 'academicYear', required: true, example: '2024-2025' }),
    __param(0, (0, common_1.Param)('studentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('academicYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], TuitionFeesController.prototype, "getStudentBalance", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiOperation)({ summary: 'جلب قسط بالمعرف' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TuitionFeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث قسط' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, tuition_fee_dto_1.UpdateTuitionFeeDto]),
    __metadata("design:returntype", void 0)
], TuitionFeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'حذف قسط' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TuitionFeesController.prototype, "remove", null);
exports.TuitionFeesController = TuitionFeesController = __decorate([
    (0, swagger_1.ApiTags)('أقساط الصفوف'),
    (0, common_1.Controller)('tuition-fees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tuition_fees_service_1.TuitionFeesService])
], TuitionFeesController);
//# sourceMappingURL=tuition-fees.controller.js.map