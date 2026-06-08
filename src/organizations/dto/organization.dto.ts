import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Cairo International School' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'school' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'cairo-international-school' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  slug: string;

  @ApiProperty({ example: 'info@cairois.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+201001234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Nile St, Cairo' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
