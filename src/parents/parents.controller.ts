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
import { ParentsService } from './parents.service';
import { CreateParentDto, UpdateParentDto } from './dto/parent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('أولياء الأمور')
@Controller('parents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'إضافة ولي أمر جديد' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() createParentDto: CreateParentDto,
  ) {
    return this.parentsService.create(orgId, createParentDto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب جميع أولياء الأمور' })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.parentsService.findAll(orgId, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({ summary: 'جلب ولي أمر بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.parentsService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'تحديث بيانات ولي الأمر' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParentDto: UpdateParentDto,
  ) {
    return this.parentsService.update(orgId, id, updateParentDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف ولي أمر' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.parentsService.remove(orgId, id);
  }
}
