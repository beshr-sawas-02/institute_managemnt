import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PlatformAuthService } from './platform-auth.service';
import { PlatformLoginDto } from '../auth/dto/auth.dto';

@ApiTags('Auth - Platform')
@Controller('platform/auth')
export class PlatformAuthController {
  constructor(private readonly platformAuthService: PlatformAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Platform admin login' })
  @ApiOkResponse({ description: 'Returns access and refresh tokens' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: PlatformLoginDto) {
    return this.platformAuthService.login(dto);
  }
}
