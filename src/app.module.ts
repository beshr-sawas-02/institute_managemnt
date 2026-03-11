import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ParentsModule } from './parents/parents.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { GradesModule } from './grades/grades.module';
import { SectionsModule } from './sections/sections.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GradeSubjectsModule } from './grade-subjects/grade-subjects.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { PaymentsModule } from './payments/payments.module';
import { ExpensesModule } from './expenses/expenses.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TuitionFeesModule } from './tuition-fees/tuition-fees.module';

@Module({
  imports: [
    // تحميل متغيرات البيئة
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // وحدة قاعدة البيانات
    PrismaModule,
    // وحدة التوثيق
    AuthModule,
    // وحدات النظام
    UsersModule,
    ParentsModule,
    TeachersModule,
    StudentsModule,
    GradesModule,
    SectionsModule,
    SubjectsModule,
    GradeSubjectsModule,
    SchedulesModule,
    AttendanceModule,
    AssessmentsModule,
    PaymentsModule,
    ExpensesModule,
    NotificationsModule,
    ReportsModule,
    DashboardModule,
    TuitionFeesModule,
  ],
})
export class AppModule {}