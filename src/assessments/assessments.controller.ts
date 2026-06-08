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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto, UpdateAssessmentDto } from './dto/assessment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('التقييمات')
@Controller('assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AssessmentsController {
  constructor(private readonly service: AssessmentsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.teacher, UserRole.reception)
  @ApiOperation({ summary: 'إضافة تقييم جديد' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() dto: CreateAssessmentDto,
  ) {
    return this.service.create(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع التقييمات مع فلترة اختيارية' })
  findAll(@CurrentUser('orgId') orgId: number, @Query() p: PaginationDto) {
    return this.service.findAll(orgId, p);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'جلب تقييمات طالب' })
  findByStudent(
    @CurrentUser('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.service.findByStudent(orgId, studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب تقييم بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.teacher, UserRole.reception)
  @ApiOperation({ summary: 'تحديث تقييم' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAssessmentDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'حذف تقييم' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(orgId, id);
  }
}
