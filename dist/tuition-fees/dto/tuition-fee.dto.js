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
exports.UpdateTuitionFeeDto = exports.CreateTuitionFeeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTuitionFeeDto {
}
exports.CreateTuitionFeeDto = CreateTuitionFeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'معرف الصف', example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTuitionFeeDto.prototype, "gradeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'السنة الدراسية', example: '2024-2025' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'السنة الدراسية مطلوبة' }),
    __metadata("design:type", String)
], CreateTuitionFeeDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'مبلغ القسط السنوي', example: 5000000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0, { message: 'المبلغ يجب أن يكون موجباً' }),
    __metadata("design:type", Number)
], CreateTuitionFeeDto.prototype, "annualAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ملاحظات' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTuitionFeeDto.prototype, "description", void 0);
class UpdateTuitionFeeDto extends (0, swagger_1.PartialType)(CreateTuitionFeeDto) {
}
exports.UpdateTuitionFeeDto = UpdateTuitionFeeDto;
//# sourceMappingURL=tuition-fee.dto.js.map