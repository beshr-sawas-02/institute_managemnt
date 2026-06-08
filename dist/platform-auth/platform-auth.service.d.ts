import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { PlatformLoginDto } from '../auth/dto/auth.dto';
export declare class PlatformAuthService {
    private prisma;
    private authService;
    constructor(prisma: PrismaService, authService: AuthService);
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
