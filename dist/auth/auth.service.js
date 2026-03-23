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
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
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
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            accessToken: token,
        };
    }
    async register(registerDto) {
        const { email, password, phone, role } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
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
            },
        });
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            accessToken: token,
        };
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
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
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
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
        return {
            ...user,
            firstName,
            lastName,
        };
    }
    generateToken(userId, email, role) {
        const payload = {
            sub: userId,
            email,
            role,
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map