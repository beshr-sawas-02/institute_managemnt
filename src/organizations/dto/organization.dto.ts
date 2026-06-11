import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  IsIn,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'مدرسة القاهرة الدولية' })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty({ example: 'Cairo International School' })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({ enum: ['school', 'institute'], example: 'school' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['school', 'institute'])
  type: 'school' | 'institute';

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

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  adminPassword: string;
}

export class UpdateOrganizationDto extends PartialType(
  OmitType(CreateOrganizationDto, ['adminPassword'] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ResetOrganizationAdminPasswordDto {
  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
