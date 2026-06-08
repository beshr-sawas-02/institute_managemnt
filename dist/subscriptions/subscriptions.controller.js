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
exports.SubscriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscriptions_service_1 = require("./subscriptions.service");
const subscription_dto_1 = require("./dto/subscription.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let SubscriptionsController = class SubscriptionsController {
    constructor(subscriptionsService) {
        this.subscriptionsService = subscriptionsService;
    }
    create(dto) {
        return this.subscriptionsService.create(dto);
    }
    findAll(p) {
        return this.subscriptionsService.findAll(p);
    }
    findOne(id) {
        return this.subscriptionsService.findOne(id);
    }
    update(id, dto) {
        return this.subscriptionsService.update(id, dto);
    }
    extend(id, dto) {
        return this.subscriptionsService.extend(id, dto);
    }
    pause(id) {
        return this.subscriptionsService.pause(id);
    }
    remove(id) {
        return this.subscriptionsService.remove(id);
    }
};
exports.SubscriptionsController = SubscriptionsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new subscription' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Subscription created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_dto_1.CreateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subscriptions' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated list of subscriptions' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subscription by id' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Subscription details' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Subscription not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update subscription' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Subscription updated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/extend'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Extend subscription end date' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Subscription extended, status reset to active',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, subscription_dto_1.ExtendSubscriptionDto]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "extend", null);
__decorate([
    (0, common_1.Patch)(':id/pause'),
    (0, decorators_1.PlatformRoles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Pause subscription' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Subscription paused' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "pause", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.PlatformRoles)('super_admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete subscription' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Subscription deleted' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SubscriptionsController.prototype, "remove", null);
exports.SubscriptionsController = SubscriptionsController = __decorate([
    (0, swagger_1.ApiTags)('Subscriptions'),
    (0, common_1.Controller)('subscriptions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [subscriptions_service_1.SubscriptionsService])
], SubscriptionsController);
//# sourceMappingURL=subscriptions.controller.js.map