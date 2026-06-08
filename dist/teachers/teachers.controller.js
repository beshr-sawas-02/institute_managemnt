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
exports.TeachersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const teachers_service_1 = require("./teachers.service");
const teacher_dto_1 = require("./dto/teacher.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let TeachersController = class TeachersController {
    constructor(teachersService) {
        this.teachersService = teachersService;
    }
    create(orgId, createTeacherDto) {
        return this.teachersService.create(orgId, createTeacherDto);
    }
    findAll(orgId, paginationDto) {
        return this.teachersService.findAll(orgId, paginationDto);
    }
    findOne(orgId, id) {
        return this.teachersService.findOne(orgId, id);
    }
    update(orgId, id, updateTeacherDto) {
        return this.teachersService.update(orgId, id, updateTeacherDto);
    }
    remove(orgId, id) {
        return this.teachersService.remove(orgId, id);
    }
};
exports.TeachersController = TeachersController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'إضافة معلم جديد' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, teacher_dto_1.CreateTeacherDto]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception),
    (0, swagger_1.ApiOperation)({ summary: 'جلب جميع المعلمين' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin, client_1.UserRole.reception, client_1.UserRole.teacher),
    (0, swagger_1.ApiOperation)({ summary: 'جلب معلم بالمعرف' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'تحديث بيانات المعلم' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, teacher_dto_1.UpdateTeacherDto]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Roles)(client_1.UserRole.admin),
    (0, swagger_1.ApiOperation)({ summary: 'حذف معلم' }),
    __param(0, (0, decorators_1.CurrentUser)('orgId')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "remove", null);
exports.TeachersController = TeachersController = __decorate([
    (0, swagger_1.ApiTags)('المعلمون'),
    (0, common_1.Controller)('teachers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService])
], TeachersController);
//# sourceMappingURL=teachers.controller.js.map