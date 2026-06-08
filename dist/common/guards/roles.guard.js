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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const decorators_1 = require("../decorators");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(decorators_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
        const requiredPlatformRoles = this.reflector.getAllAndOverride(decorators_1.PLATFORM_ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles?.length && !requiredPlatformRoles?.length) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.ForbiddenException('غير مصرح بالوصول');
        }
        if (requiredPlatformRoles?.length) {
            if (user.source !== 'platform') {
                throw new common_1.ForbiddenException('ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد');
            }
            if (!requiredPlatformRoles.includes(user.role)) {
                throw new common_1.ForbiddenException('ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد');
            }
            return true;
        }
        if (requiredRoles?.length) {
            if (user.source !== 'org') {
                throw new common_1.ForbiddenException('ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد');
            }
            if (!requiredRoles.includes(user.role)) {
                throw new common_1.ForbiddenException('ليس لديك الصلاحيات الكافية للوصول إلى هذا المورد');
            }
            return true;
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map