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
exports.UpdateFcmTokenDto = exports.UpdatePreferredLanguageDto = exports.ChangePasswordDto = exports.RegisterDto = exports.LoginDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'admin@school.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'البريد الإلكتروني غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'البريد الإلكتروني مطلوب' }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password', example: 'password123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'كلمة المرور مطلوبة' }),
    (0, class_validator_1.MinLength)(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.AppLanguage,
        description: 'Current app language to sync with notification delivery',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AppLanguage),
    __metadata("design:type", String)
], LoginDto.prototype, "preferredLanguage", void 0);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', example: 'user@school.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'البريد الإلكتروني غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'البريد الإلكتروني مطلوب' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Password', example: 'password123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'كلمة المرور مطلوبة' }),
    (0, class_validator_1.MinLength)(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number', example: '+966501234567' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: client_1.AppLanguage,
        description: 'Current app language to sync with notification delivery',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AppLanguage),
    __metadata("design:type", String)
], RegisterDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User role',
        enum: client_1.UserRole,
        example: 'student',
    }),
    (0, class_validator_1.IsEnum)(client_1.UserRole, { message: 'الدور غير صالح' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'الدور مطلوب' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class ChangePasswordDto {
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'كلمة المرور الحالية مطلوبة' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'كلمة المرور الجديدة مطلوبة' }),
    (0, class_validator_1.MinLength)(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class UpdatePreferredLanguageDto {
}
exports.UpdatePreferredLanguageDto = UpdatePreferredLanguageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.AppLanguage,
        description: 'Preferred language used for notifications and profile responses',
    }),
    (0, class_validator_1.IsEnum)(client_1.AppLanguage),
    __metadata("design:type", String)
], UpdatePreferredLanguageDto.prototype, "preferredLanguage", void 0);
class UpdateFcmTokenDto {
}
exports.UpdateFcmTokenDto = UpdateFcmTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FCM token for push notifications' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'رمز FCM مطلوب' }),
    __metadata("design:type", String)
], UpdateFcmTokenDto.prototype, "fcmToken", void 0);
//# sourceMappingURL=auth.dto.js.map