/*
  Warnings:

  - You are about to drop the column `schedule_id` on the `attendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,date]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_schedule_id_fkey";

-- DropIndex
DROP INDEX "attendance_student_id_schedule_id_date_key";

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "schedule_id";

-- CreateIndex
CREATE UNIQUE INDEX "attendance_student_id_date_key" ON "attendance"("student_id", "date");
