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
import { ReceptionService } from './reception.service';
import { CreateReceptionDto, UpdateReceptionDto } from './dto/reception.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';

@ApiTags('Reception')
@Controller('reception')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Post()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Create a reception user profile' })
  create(@Body() createReceptionDto: CreateReceptionDto) {
    return this.receptionService.create(createReceptionDto);
  }

  @Get()
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get all reception users' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.receptionService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Get reception user by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.receptionService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Update reception user' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReceptionDto: UpdateReceptionDto,
  ) {
    return this.receptionService.update(id, updateReceptionDto);
  }

  @Delete(':id')
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Delete reception user' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.receptionService.remove(id);
  }
}
