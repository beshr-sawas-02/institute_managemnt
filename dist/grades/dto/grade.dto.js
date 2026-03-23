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
exports.UpdateGradeDto = exports.CreateGradeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateGradeDto {
}
exports.CreateGradeDto = CreateGradeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'الصف الأول' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم الصف مطلوب' }),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.GradeLevel, description: 'المرحلة الدراسية' }),
    (0, class_validator_1.IsEnum)(client_1.GradeLevel, { message: 'المرحلة غير صالحة' }),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "description", void 0);
class UpdateGradeDto extends (0, swagger_1.PartialType)(CreateGradeDto) {
}
exports.UpdateGradeDto = UpdateGradeDto;
//# sourceMappingURL=grade.dto.js.map