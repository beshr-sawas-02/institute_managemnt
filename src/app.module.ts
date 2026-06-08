import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { PlatformAuthModule } from './platform-auth/platform-auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
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
import { ReceptionModule } from './reception/reception.module';
import { SubscriptionMiddleware } from './common/middleware/subscription.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    PlatformAuthModule,
    OrganizationsModule,
    SubscriptionsModule,
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
    ReceptionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SubscriptionMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
