/*
  Warnings:

  - Made the column `teacher_id` on table `grade_subjects` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "grade_subjects" DROP CONSTRAINT "grade_subjects_teacher_id_fkey";

-- AlterTable
ALTER TABLE "grade_subjects" ADD COLUMN     "section_id" INTEGER,
ALTER COLUMN "teacher_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "grade_subjects" ADD CONSTRAINT "grade_subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_subjects" ADD CONSTRAINT "grade_subjects_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
