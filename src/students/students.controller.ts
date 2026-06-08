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
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('الطلاب')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'تسجيل طالب جديد' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    return this.studentsService.create(orgId, createStudentDto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب جميع الطلاب' })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.studentsService.findAll(orgId, paginationDto);
  }

  @Get('section/:sectionId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher)
  @ApiOperation({ summary: 'جلب طلاب شعبة معينة' })
  findBySection(
    @CurrentUser('orgId') orgId: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
  ) {
    return this.studentsService.findBySection(orgId, sectionId);
  }

  @Get('parent/:parentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({ summary: 'جلب طلاب ولي أمر معين' })
  findByParent(
    @CurrentUser('orgId') orgId: number,
    @Param('parentId', ParseIntPipe) parentId: number,
  ) {
    return this.studentsService.findByParent(orgId, parentId);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.teacher, UserRole.parent)
  @ApiOperation({ summary: 'جلب طالب بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.studentsService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'تحديث بيانات طالب' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(orgId, id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف طالب' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.studentsService.remove(orgId, id);
  }
}
