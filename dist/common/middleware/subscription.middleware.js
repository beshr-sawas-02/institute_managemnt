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
exports.SubscriptionMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let SubscriptionMiddleware = class SubscriptionMiddleware {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async use(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        let payload;
        try {
            payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        }
        catch {
            return next();
        }
        if (!payload || payload.source !== 'org' || !payload.orgId) {
            return next();
        }
        const org = await prisma.organization.findUnique({
            where: { id: payload.orgId },
            select: { isActive: true },
        });
        if (!org || !org.isActive) {
            throw new common_1.ForbiddenException('المؤسسة غير مفعلة');
        }
        const activeSub = await prisma.subscription.findFirst({
            where: { organizationId: payload.orgId, status: 'active' },
            select: { id: true },
        });
        const totalSubs = await prisma.subscription.count({
            where: { organizationId: payload.orgId },
        });
        if (totalSubs > 0 && !activeSub) {
            throw new common_1.ForbiddenException('انتهت صلاحية الاشتراك. تواصل مع الإدارة');
        }
        next();
    }
};
exports.SubscriptionMiddleware = SubscriptionMiddleware;
exports.SubscriptionMiddleware = SubscriptionMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], SubscriptionMiddleware);
//# sourceMappingURL=subscription.middleware.js.map