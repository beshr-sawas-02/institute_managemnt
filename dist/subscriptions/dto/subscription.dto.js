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
exports.UpdateSubscriptionStatusDto = exports.ExtendSubscriptionDto = exports.UpdateSubscriptionDto = exports.CreateSubscriptionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSubscriptionDto {
}
exports.CreateSubscriptionDto = CreateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSubscriptionDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "endDate", void 0);
class UpdateSubscriptionDto extends (0, swagger_1.PartialType)(CreateSubscriptionDto) {
}
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
class ExtendSubscriptionDto {
}
exports.ExtendSubscriptionDto = ExtendSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New end date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExtendSubscriptionDto.prototype, "endDate", void 0);
class UpdateSubscriptionStatusDto {
}
exports.UpdateSubscriptionStatusDto = UpdateSubscriptionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['active', 'paused'] }),
    (0, class_validator_1.IsIn)(['active', 'paused']),
    __metadata("design:type", String)
], UpdateSubscriptionStatusDto.prototype, "status", void 0);
//# sourceMappingURL=subscription.dto.js.map