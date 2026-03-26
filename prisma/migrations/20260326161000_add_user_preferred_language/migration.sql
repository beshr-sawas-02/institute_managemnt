CREATE TYPE "AppLanguage" AS ENUM ('ar', 'en');

ALTER TABLE "users"
ADD COLUMN "preferred_language" "AppLanguage" NOT NULL DEFAULT 'ar';
