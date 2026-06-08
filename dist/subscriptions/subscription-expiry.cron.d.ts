import { PrismaService } from '../prisma/prisma.service';
export declare class SubscriptionExpiryCron {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleSubscriptionExpiry(): Promise<void>;
}
