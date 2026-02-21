// src/expenses/dto/expense.dto.ts
import {
  IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';

export class CreateExpenseDto {
  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory, { message: 'فئة المصروف غير صالحة' })
  category: ExpenseCategory;

  @ApiProperty({ example: 'صيانة المكيفات' })
  @IsString()
  @IsNotEmpty({ message: 'الوصف مطلوب' })
  description: string;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2024-09-20' })
  @IsDateString()
  expenseDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attachments?: string;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}