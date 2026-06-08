import { PlatformAuthService } from './platform-auth.service';
import { PlatformLoginDto } from '../auth/dto/auth.dto';
export declare class PlatformAuthController {
    private readonly platformAuthService;
    constructor(platformAuthService: PlatformAuthService);
    login(dto: PlatformLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            role: string;
            source: string;
        };
    }>;
}
