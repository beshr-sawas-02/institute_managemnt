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
exports.UpdateParentDto = exports.CreateParentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateParentDto {
}
exports.CreateParentDto = CreateParentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'معرف المستخدم المرتبط' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateParentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'الاسم الأول', example: 'أحمد' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'الاسم الأول مطلوب' }),
    __metadata("design:type", String)
], CreateParentDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'اسم العائلة', example: 'محمد' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم العائلة مطلوب' }),
    __metadata("design:type", String)
], CreateParentDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'رقم الهاتف', example: '+966501234567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'رقم الهاتف مطلوب' }),
    __metadata("design:type", String)
], CreateParentDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'البريد الإلكتروني' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateParentDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'العنوان' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateParentDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'صلة القرابة', enum: client_1.Relationship }),
    (0, class_validator_1.IsEnum)(client_1.Relationship, { message: 'صلة القرابة غير صالحة' }),
    __metadata("design:type", String)
], CreateParentDto.prototype, "relationship", void 0);
class UpdateParentDto extends (0, swagger_1.PartialType)(CreateParentDto) {
}
exports.UpdateParentDto = UpdateParentDto;
//# sourceMappingURL=parent.dto.js.map