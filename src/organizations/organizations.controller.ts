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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './dto/organization.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { PlatformRoles } from '../common/decorators';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Post()
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiCreatedResponse({ description: 'Organization created successfully' })
  create(@Body() dto: CreateOrganizationDto) {
    return this.service.create(dto);
  }

  @Get()
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiOkResponse({ description: 'Paginated list of organizations' })
  findAll(@Query() p: PaginationDto) {
    return this.service.findAll(p);
  }

  @Get(':id')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get organization by id' })
  @ApiOkResponse({ description: 'Organization details' })
  @ApiNotFoundResponse({ description: 'Organization not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Update organization' })
  @ApiOkResponse({ description: 'Organization updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @PlatformRoles('super_admin')
  @ApiOperation({ summary: 'Delete organization' })
  @ApiOkResponse({ description: 'Organization deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
