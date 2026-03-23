"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const parents_module_1 = require("./parents/parents.module");
const teachers_module_1 = require("./teachers/teachers.module");
const students_module_1 = require("./students/students.module");
const grades_module_1 = require("./grades/grades.module");
const sections_module_1 = require("./sections/sections.module");
const subjects_module_1 = require("./subjects/subjects.module");
const grade_subjects_module_1 = require("./grade-subjects/grade-subjects.module");
const schedules_module_1 = require("./schedules/schedules.module");
const attendance_module_1 = require("./attendance/attendance.module");
const assessments_module_1 = require("./assessments/assessments.module");
const payments_module_1 = require("./payments/payments.module");
const expenses_module_1 = require("./expenses/expenses.module");
const notifications_module_1 = require("./notifications/notifications.module");
const reports_module_1 = require("./reports/reports.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const tuition_fees_module_1 = require("./tuition-fees/tuition-fees.module");
const reception_module_1 = require("./reception/reception.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            parents_module_1.ParentsModule,
            teachers_module_1.TeachersModule,
            students_module_1.StudentsModule,
            grades_module_1.GradesModule,
            sections_module_1.SectionsModule,
            subjects_module_1.SubjectsModule,
            grade_subjects_module_1.GradeSubjectsModule,
            schedules_module_1.SchedulesModule,
            attendance_module_1.AttendanceModule,
            assessments_module_1.AssessmentsModule,
            payments_module_1.PaymentsModule,
            expenses_module_1.ExpensesModule,
            notifications_module_1.NotificationsModule,
            reports_module_1.ReportsModule,
            dashboard_module_1.DashboardModule,
            tuition_fees_module_1.TuitionFeesModule,
            reception_module_1.ReceptionModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map