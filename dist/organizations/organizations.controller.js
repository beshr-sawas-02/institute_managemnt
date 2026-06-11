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
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const swagger_1 = require("@nestjs/swagger");
const organizations_service_1 = require("./organizations.service");
const organization_dto_1 = require("./dto/organization.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let OrganizationsController = class OrganizationsController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(p) {
        return this.service.findAll(p);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    resetAdminPassword(id, dto) {
        return this.service.resetAdminPassword(id, dto.newPassword);
    }
    uploadLogo(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('ملف الشعار مطلوب أو نوعه غير مدعوم');
        }
        return this.service.updateLogo(id, `/uploads/organizations/${id}/${file.filename}`);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new organization' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Organization created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_dto_1.CreateOrganizationDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all organizations' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated list of organizations' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get organization by id' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Organization details' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Organization not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update organization' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Organization updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, organization_dto_1.UpdateOrganizationDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/admin-password'),
    (0, decorators_1.PlatformRoles)('super_admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset organization admin password' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Organization admin password reset' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, organization_dto_1.ResetOrganizationAdminPasswordDto]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "resetAdminPassword", null);
__decorate([
    (0, common_1.Patch)(':id/logo'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, _file, callback) => {
                const directory = (0, path_1.join)(process.cwd(), 'uploads', 'organizations', req.params.id);
                (0, fs_1.mkdirSync)(directory, { recursive: true });
                callback(null, directory);
            },
            filename: (_req, file, callback) => {
                const extensions = {
                    'image/jpeg': '.jpg',
                    'image/png': '.png',
                    'image/webp': '.webp',
                };
                const extension = extensions[file.mimetype] ||
                    (0, path_1.extname)(file.originalname).toLowerCase();
                callback(null, `logo-${Date.now()}${extension}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_req, file, callback) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            callback(null, allowedTypes.includes(file.mimetype));
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Upload organization logo' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Organization logo uploaded' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.PlatformRoles)('super_admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete organization' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Organization deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], OrganizationsController.prototype, "remove", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('Organizations'),
    (0, common_1.Controller)('organizations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [organizations_service_1.OrganizationsService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map