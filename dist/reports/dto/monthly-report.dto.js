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
exports.GenerateSectionMonthlyReportDto = exports.GenerateMonthlyReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class GenerateMonthlyReportDto {
}
exports.GenerateMonthlyReportDto = GenerateMonthlyReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'رقم الشهر (1-12)', example: 3 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'الشهر يجب أن يكون بين 1 و 12' }),
    (0, class_validator_1.Max)(12, { message: 'الشهر يجب أن يكون بين 1 و 12' }),
    __metadata("design:type", Number)
], GenerateMonthlyReportDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'السنة', example: 2025 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2020),
    __metadata("design:type", Number)
], GenerateMonthlyReportDto.prototype, "year", void 0);
class GenerateSectionMonthlyReportDto extends GenerateMonthlyReportDto {
}
exports.GenerateSectionMonthlyReportDto = GenerateSectionMonthlyReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'معرف الشعبة', example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], GenerateSectionMonthlyReportDto.prototype, "sectionId", void 0);
//# sourceMappingURL=monthly-report.dto.js.map