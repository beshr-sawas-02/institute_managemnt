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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('المواد الدراسية')
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إضافة مادة جديدة' })
  create(@CurrentUser('orgId') orgId: number, @Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(orgId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'جلب جميع المواد' })
  findAll(@CurrentUser('orgId') orgId: number, @Query() p: PaginationDto) {
    return this.subjectsService.findAll(orgId, p);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب مادة بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subjectsService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث مادة' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف مادة' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.subjectsService.remove(orgId, id);
  }
}
