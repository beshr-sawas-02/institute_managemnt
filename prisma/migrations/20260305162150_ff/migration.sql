/*
  Warnings:

  - A unique constraint covering the columns `[grade_id,subject_id,section_id]` on the table `grade_subjects` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "grade_subjects_grade_id_subject_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "grade_subjects_grade_id_subject_id_section_id_key" ON "grade_subjects"("grade_id", "subject_id", "section_id");
