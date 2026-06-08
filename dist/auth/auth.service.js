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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        const { email, password, slug, preferredLanguage } = loginDto;
        const organization = await this.prisma.organization.findUnique({
            where: { slug },
        });
        if (!organization) {
            throw new common_1.UnauthorizedException('المؤسسة غير موجودة');
        }
        if (!organization.isActive) {
            throw new common_1.UnauthorizedException('المؤسسة غير مفعلة');
        }
        const user = await this.prisma.user.findFirst({
            where: { email, organizationId: organization.id },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('الحساب معطل. تواصل مع الإدارة');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                ...(preferredLanguage ? { preferredLanguage } : {}),
            },
        });
        const tokens = await this.generateOrgTokens(updatedUser.id, updatedUser.email, updatedUser.role, organization.id);
        return {
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                orgId: organization.id,
                preferredLanguage: updatedUser.preferredLanguage,
                source: 'org',
            },
            ...tokens,
        };
    }
    async register(registerDto) {
        const { email, password, phone, role, preferredLanguage, slug } = registerDto;
        const organization = await this.prisma.organization.findUnique({
            where: { slug },
        });
        if (!organization) {
            throw new common_1.BadRequestException('المؤسسة غير موجودة');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: { email, organizationId: organization.id },
        });
        if (existingUser) {
            throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                phone,
                role,
                organizationId: organization.id,
                preferredLanguage: preferredLanguage ?? 'ar',
            },
        });
        const tokens = await this.generateOrgTokens(user.id, user.email, user.role, organization.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                orgId: organization.id,
                preferredLanguage: user.preferredLanguage,
                source: 'org',
            },
            ...tokens,
        };
    }
    async refresh(dto) {
        let payload;
        try {
            payload = this.jwtService.verify(dto.refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('رمز التحديث غير صالح أو منتهي الصلاحية');
        }
        if (payload.source === 'platform') {
            const platformUser = await this.prisma.platformUser.findUnique({
                where: { id: payload.sub },
            });
            if (!platformUser || !platformUser.isActive) {
                throw new common_1.UnauthorizedException('المستخدم غير موجود');
            }
            const tokens = await this.generatePlatformTokens(platformUser.id, platformUser.email, platformUser.role);
            return tokens;
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('المستخدم غير موجود');
        }
        const tokens = await this.generateOrgTokens(user.id, user.email, user.role, user.organizationId);
        return tokens;
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('المستخدم غير موجود');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('كلمة المرور الحالية غير صحيحة');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { message: 'تم تغيير كلمة المرور بنجاح' };
    }
    async updatePreferredLanguage(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw new common_1.BadRequestException('المستخدم غير موجود');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { preferredLanguage: dto.preferredLanguage },
            select: { id: true, preferredLanguage: true, updatedAt: true },
        });
        return { message: 'تم تحديث لغة التطبيق بنجاح', user: updatedUser };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                preferredLanguage: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                organizationId: true,
                student: true,
                teacher: true,
                parent: true,
                reception: true,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('المستخدم غير موجود');
        }
        let firstName = null;
        let lastName = null;
        if (user.role === 'reception' && user.reception) {
            firstName = user.reception.firstName;
            lastName = user.reception.lastName;
        }
        else if (user.role === 'teacher' && user.teacher) {
            firstName = user.teacher.firstName;
            lastName = user.teacher.lastName;
        }
        else if (user.role === 'parent' && user.parent) {
            firstName = user.parent.firstName;
            lastName = user.parent.lastName;
        }
        else if (user.role === 'student' && user.student) {
            firstName = user.student.firstName;
            lastName = user.student.lastName;
        }
        return { ...user, firstName, lastName };
    }
    async generateOrgTokens(userId, email, role, orgId) {
        const payload = { sub: userId, email, role, orgId, source: 'org' };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
        return { accessToken, refreshToken };
    }
    async generatePlatformTokens(userId, email, role) {
        const payload = {
            sub: userId,
            email,
            role,
            orgId: null,
            source: 'platform',
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map