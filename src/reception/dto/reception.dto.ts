// src/reception/dto/reception.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsEmail, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateReceptionDto {
  @ApiPropertyOptional({ description: 'Linked user id' })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({ description: 'First name', example: 'Ahmad' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Khaled' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ description: 'Phone number', example: '+966501234567' })
  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @ApiProperty({ description: 'Email address', example: 'reception@school.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class UpdateReceptionDto extends PartialType(CreateReceptionDto) {}
