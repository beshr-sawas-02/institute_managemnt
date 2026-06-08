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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';

@ApiTags('المستخدمون')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
  create(
    @CurrentUser('orgId') orgId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(orgId, createUserDto);
  }

  @Post('parent')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إنشاء حساب ولي أمر' })
  createParentUser(
    @CurrentUser('orgId') orgId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.createParentUser(orgId, createUserDto);
  }

  @Post('reception')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'إنشاء حساب موظف استقبال' })
  createReceptionUser(
    @CurrentUser('orgId') orgId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.createReceptionUser(orgId, createUserDto);
  }

  @Get()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'جلب جميع المستخدمين' })
  findAll(
    @CurrentUser('orgId') orgId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.usersService.findAll(orgId, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'جلب مستخدم بالمعرف' })
  findOne(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'تحديث مستخدم' })
  update(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(orgId, id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'حذف مستخدم' })
  remove(
    @CurrentUser('orgId') orgId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usersService.remove(orgId, id);
  }
}
