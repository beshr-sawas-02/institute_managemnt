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
exports.PlatformAuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
let PlatformAuthService = class PlatformAuthService {
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    async login(dto) {
        const { email, password } = dto;
        const platformUser = await this.prisma.platformUser.findUnique({
            where: { email },
        });
        if (!platformUser) {
            throw new common_1.UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        if (!platformUser.isActive) {
            throw new common_1.UnauthorizedException('الحساب معطل');
        }
        const isPasswordValid = await bcrypt.compare(password, platformUser.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        await this.prisma.platformUser.update({
            where: { id: platformUser.id },
            data: { lastLogin: new Date() },
        });
        const tokens = await this.authService.generatePlatformTokens(platformUser.id, platformUser.email, platformUser.role);
        return {
            user: {
                id: platformUser.id,
                email: platformUser.email,
                role: platformUser.role,
                source: 'platform',
            },
            ...tokens,
        };
    }
};
exports.PlatformAuthService = PlatformAuthService;
exports.PlatformAuthService = PlatformAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], PlatformAuthService);
//# sourceMappingURL=platform-auth.service.js.map