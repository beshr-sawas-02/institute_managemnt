import { Module } from '@nestjs/common';
import { PlatformAuthService } from './platform-auth.service';
import { PlatformAuthController } from './platform-auth.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PlatformAuthController],
  providers: [PlatformAuthService],
})
export class PlatformAuthModule {}
