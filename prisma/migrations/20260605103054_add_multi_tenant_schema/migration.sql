-- Create organizations table first
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "logo" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- Create subscriptions table
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "plan" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- Create platform_users table
CREATE TABLE "platform_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "platform_users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "platform_users_email_key" ON "platform_users"("email");

-- Insert a default organization to absorb all existing data
INSERT INTO "organizations" ("name", "type", "slug", "email", "is_active", "updated_at")
VALUES ('Default Organization', 'school', 'default-org', 'admin@default.com', true, NOW());

-- Add organization_id as nullable first to all 13 tables
ALTER TABLE "users"         ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "reception"     ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "parents"       ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "teachers"      ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "grades"        ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "sections"      ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "students"      ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "subjects"      ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "expenses"      ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "payments"      ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "tuition_fees"  ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "reports"       ADD COLUMN "organization_id" INTEGER;
ALTER TABLE "notifications" ADD COLUMN "organization_id" INTEGER;

-- Assign all existing rows to the default organization (id = 1)
UPDATE "users"         SET "organization_id" = 1;
UPDATE "reception"     SET "organization_id" = 1;
UPDATE "parents"       SET "organization_id" = 1;
UPDATE "teachers"      SET "organization_id" = 1;
UPDATE "grades"        SET "organization_id" = 1;
UPDATE "sections"      SET "organization_id" = 1;
UPDATE "students"      SET "organization_id" = 1;
UPDATE "subjects"      SET "organization_id" = 1;
UPDATE "expenses"      SET "organization_id" = 1;
UPDATE "payments"      SET "organization_id" = 1;
UPDATE "tuition_fees"  SET "organization_id" = 1;
UPDATE "reports"       SET "organization_id" = 1;
UPDATE "notifications" SET "organization_id" = 1;

-- Now make the column NOT NULL
ALTER TABLE "users"         ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "reception"     ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "parents"       ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "teachers"      ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "grades"        ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "sections"      ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "students"      ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "subjects"      ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "expenses"      ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "payments"      ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "tuition_fees"  ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "reports"       ALTER COLUMN "organization_id" SET NOT NULL;
ALTER TABLE "notifications" ALTER COLUMN "organization_id" SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE "subscriptions"  ADD CONSTRAINT "subscriptions_organization_id_fkey"  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "users"          ADD CONSTRAINT "users_organization_id_fkey"          FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "reception"      ADD CONSTRAINT "reception_organization_id_fkey"      FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "parents"        ADD CONSTRAINT "parents_organization_id_fkey"        FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "teachers"       ADD CONSTRAINT "teachers_organization_id_fkey"       FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "grades"         ADD CONSTRAINT "grades_organization_id_fkey"         FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "sections"       ADD CONSTRAINT "sections_organization_id_fkey"       FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "students"       ADD CONSTRAINT "students_organization_id_fkey"       FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "subjects"       ADD CONSTRAINT "subjects_organization_id_fkey"       FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "expenses"       ADD CONSTRAINT "expenses_organization_id_fkey"       FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "payments"       ADD CONSTRAINT "payments_organization_id_fkey"       FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "tuition_fees"   ADD CONSTRAINT "tuition_fees_organization_id_fkey"   FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "reports"        ADD CONSTRAINT "reports_organization_id_fkey"        FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;
ALTER TABLE "notifications"  ADD CONSTRAINT "notifications_organization_id_fkey"  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON UPDATE CASCADE;