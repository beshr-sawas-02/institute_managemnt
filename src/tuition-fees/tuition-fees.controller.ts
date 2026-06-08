import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { TuitionFeesService } from './tuition-fees.service';
import {
  CreateTuitionFeeDto,
  UpdateTuitionFeeDto,
} from './dto/tuition-fee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('أقساط الصفوف')
@Controller('tuition-fees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TuitionFeesController {
  constructor(private readonly service: TuitionFeesService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديد قسط سنوي لصف' })
  create(
    @CurrentUser('orgId') orgId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateTuitionFeeDto,
  ) {
    return this.service.create(orgId, userId, dto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب جميع أقساط الصفوف' })
  @ApiQuery({ name: 'academicYear', required: false })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.service.findAll(orgId, academicYear);
  }

  @Get('grade/:gradeId')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب قسط صف معين لسنة دراسية' })
  @ApiQuery({ name: 'academicYear', required: true })
  findByGrade(
    @CurrentUser('orgId') orgId: number,
    @Param('gradeId', ParseIntPipe) gradeId: number,
    @Query('academicYear') academicYear: string,
  ) {
    return this.service.findByGrade(orgId, gradeId, academicYear);
  }

  @Get('student/:studentId/balance')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({ summary: 'رصيد الطالب' })
  @ApiQuery({ name: 'academicYear', required: true })
  getStudentBalance(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('academicYear') academicYear: string,
  ) {
    return this.service.getStudentBalance(studentId, academicYear);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب قسط بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث قسط' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTuitionFeeDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف قسط' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(orgId, id);
  }
}
