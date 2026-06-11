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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('المدفوعات')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'إنشاء دفعة جديدة' })
  create(@CurrentUser('orgId') orgId: number, @Body() dto: CreatePaymentDto) {
    return this.service.create(orgId, dto);
  }

  @Get()
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'جلب جميع المدفوعات' })
  findAll(@CurrentUser('orgId') orgId: number, @Query() p: PaginationDto) {
    return this.service.findAll(orgId, p);
  }

  @Get('stats')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إحصائيات المدفوعات' })
  getStats(
    @CurrentUser('orgId') orgId: number,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.service.getStats(orgId, academicYear);
  }

  @Get('student/:studentId')
  @Roles(UserRole.admin, UserRole.reception, UserRole.parent)
  @ApiOperation({ summary: 'جلب مدفوعات طالب مع رصيده' })
  @ApiQuery({ name: 'academicYear', required: false })
  findByStudent(
    @CurrentUser('orgId') orgId: number,
    @Param('studentId', ParseIntPipe) id: number,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.service.findByStudent(orgId, id, academicYear);
  }

  @Get(':id')
  @ApiOperation({ summary: 'جلب دفعة بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin, UserRole.reception)
  @ApiOperation({ summary: 'تحديث دفعة' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.service.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف دفعة' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(orgId, id);
  }
}
