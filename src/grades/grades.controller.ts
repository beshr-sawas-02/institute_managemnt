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
import { GradesService } from './grades.service';
import { CreateGradeDto, UpdateGradeDto } from './dto/grade.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('الصفوف')
@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إضافة صف جديد' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() createGradeDto: CreateGradeDto,
  ) {
    return this.gradesService.create(orgId, createGradeDto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب جميع الصفوف' })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.gradesService.findAll(orgId, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب صف بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.gradesService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث صف' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return this.gradesService.update(orgId, id, updateGradeDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف صف' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.gradesService.remove(orgId, id);
  }
}
