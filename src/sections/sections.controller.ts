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
import { SectionsService } from './sections.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('الشعب')
@Controller('sections')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إضافة شعبة جديدة' })
  create(@CurrentUser('orgId') orgId: number, @Body() dto: CreateSectionDto) {
    return this.sectionsService.create(orgId, dto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب جميع الشعب' })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.sectionsService.findAll(orgId, paginationDto);
  }

  @Get('grade/:gradeId')
  @ApiOperation({ summary: 'جلب شعب صف معين' })
  findByGrade(
    @CurrentUser('orgId') orgId: number,
    @Param('gradeId', ParseIntPipe) gradeId: number,
  ) {
    return this.sectionsService.findByGrade(orgId, gradeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب شعبة بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sectionsService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث شعبة' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف شعبة' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.sectionsService.remove(orgId, id);
  }
}
