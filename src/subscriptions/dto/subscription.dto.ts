import {
  IsInt,
  IsString,
  IsDecimal,
  IsDateString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty()
  @IsInt()
  organizationId: number;

  @ApiProperty()
  @IsString()
  plan: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}

export class ExtendSubscriptionDto {
  @ApiProperty({ description: 'New end date' })
  @IsDateString()
  endDate: string;
}

export class UpdateSubscriptionStatusDto {
  @ApiProperty({ enum: ['active', 'paused'] })
  @IsIn(['active', 'paused'])
  status: 'active' | 'paused';
}
