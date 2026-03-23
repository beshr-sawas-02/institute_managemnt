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
exports.UpdateSectionDto = exports.CreateSectionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateSectionDto {
}
exports.CreateSectionDto = CreateSectionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSectionDto.prototype, "gradeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'أ' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم الشعبة مطلوب' }),
    __metadata("design:type", String)
], CreateSectionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-2025' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'السنة الدراسية مطلوبة' }),
    __metadata("design:type", String)
], CreateSectionDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSectionDto.prototype, "maxStudents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.SectionStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.SectionStatus),
    __metadata("design:type", String)
], CreateSectionDto.prototype, "status", void 0);
class UpdateSectionDto extends (0, swagger_1.PartialType)(CreateSectionDto) {
}
exports.UpdateSectionDto = UpdateSectionDto;
//# sourceMappingURL=section.dto.js.map