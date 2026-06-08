import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { GradeSubjectsService } from './grade-subjects.service';
import {
  CreateGradeSubjectDto,
  UpdateGradeSubjectDto,
} from './dto/grade-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('مواد الصفوف')
@Controller('grade-subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GradeSubjectsController {
  constructor(private readonly service: GradeSubjectsService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'ربط مادة بصف' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() dto: CreateGradeSubjectDto,
  ) {
    return this.service.create(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع مواد الصفوف' })
  findAll(@CurrentUser('orgId') orgId: number) {
    return this.service.findAll(orgId);
  }

  @Get('grade/:gradeId')
  @ApiOperation({ summary: 'جلب مواد صف معين' })
  findByGrade(
    @CurrentUser('orgId') orgId: number,
    @Param('gradeId', ParseIntPipe) gradeId: number,
  ) {
    return this.service.findByGrade(orgId, gradeId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'جلب مواد معلم معين' })
  findByTeacher(
    @CurrentUser('orgId') orgId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
  ) {
    return this.service.findByTeacher(orgId, teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب مادة صف بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث ربط مادة بصف' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGradeSubjectDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف ربط مادة بصف' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(orgId, id);
  }
}
