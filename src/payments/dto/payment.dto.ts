// src/payments/dto/payment.dto.ts
import {
  IsInt, IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty()
  @IsInt()
  studentId: number;

  @ApiProperty({ example: '2024-2025' })
  @IsString()
  @IsNotEmpty()
  academicYear: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ example: '2024-10-01' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ example: '2024-09-25' })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}