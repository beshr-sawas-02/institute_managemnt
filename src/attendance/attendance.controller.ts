import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  BulkAttendanceDto,
  SmartBulkAttendanceDto,
  UpdateAttendanceDto,
} from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';
import { Roles, CurrentUser } from '../common/decorators';
import { RolesGuard } from '../common/guards';

@ApiTags('الحضور')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تسجيل حضور طالب واحد' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() dto: CreateAttendanceDto,
  ) {
    return this.attendanceService.create(orgId, dto);
  }

  @Post('bulk')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تسجيل حضور جماعي يدوي' })
  bulkCreate(
    @CurrentUser('orgId') orgId: number,
    @Body() dto: BulkAttendanceDto,
  ) {
    return this.attendanceService.bulkCreate(orgId, dto);
  }

  @Post('smart-bulk')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تسجيل حضور ذكي - الكل حضور ما عدا الاستثناءات' })
  smartBulkCreate(
    @CurrentUser('orgId') orgId: number,
    @Body() dto: SmartBulkAttendanceDto,
  ) {
    return this.attendanceService.smartBulkCreate(orgId, dto);
  }

  @Get('section/:sectionId/sheet')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'كشف حضور الشعبة ليوم معين' })
  @ApiQuery({ name: 'date', example: '2025-09-14' })
  getSectionSheet(
    @CurrentUser('orgId') orgId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getSectionAttendanceSheet(
      orgId,
      sectionId,
      date,
    );
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب سجلات الحضور مع فلترة' })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query('date') date?: string,
    @Query('sectionId') sectionId?: string,
  ) {
    return this.attendanceService.findAll(orgId, {
      date,
      sectionId: sectionId ? parseInt(sectionId) : undefined,
    });
  }

  @Get('section/:sectionId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'حضور شعبة في يوم معين' })
  @ApiQuery({ name: 'date', example: '2025-09-14' })
  findBySection(
    @CurrentUser('orgId') orgId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Query('date') date: string,
  ) {
    return this.attendanceService.findBySection(orgId, sectionId, date);
  }

  @Get('student/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher, UserRole.parent)
  @ApiOperation({ summary: 'سجل حضور طالب معين' })
  findByStudent(
    @CurrentUser('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.attendanceService.findByStudent(
      orgId,
      studentId,
      dateFrom,
      dateTo,
    );
  }

  @Get('stats/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher, UserRole.parent)
  @ApiOperation({ summary: 'إحصائيات حضور طالب' })
  getStats(
    @CurrentUser('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.attendanceService.getStats(orgId, studentId, dateFrom, dateTo);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تفاصيل سجل حضور' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.attendanceService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'تعديل سجل حضور' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف سجل حضور' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.attendanceService.remove(orgId, id);
  }
}
