-- AlterEnum
ALTER TYPE "NotificationRelatedType" ADD VALUE 'monthly_report';

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "data" JSONB;
