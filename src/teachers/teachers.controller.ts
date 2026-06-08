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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('المعلمون')
@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إضافة معلم جديد' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() createTeacherDto: CreateTeacherDto,
  ) {
    return this.teachersService.create(orgId, createTeacherDto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب جميع المعلمين' })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.teachersService.findAll(orgId, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب معلم بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.teachersService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث بيانات المعلم' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(orgId, id, updateTeacherDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف معلم' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.teachersService.remove(orgId, id);
  }
}
