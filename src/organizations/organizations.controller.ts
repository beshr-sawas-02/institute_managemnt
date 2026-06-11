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
  UseInterceptors,
  ParseIntPipe,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
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
  ResetOrganizationAdminPasswordDto,
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

  @Patch(':id/admin-password')
  @PlatformRoles('super_admin')
  @ApiOperation({ summary: 'Reset organization admin password' })
  @ApiOkResponse({ description: 'Organization admin password reset' })
  resetAdminPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetOrganizationAdminPasswordDto,
  ) {
    return this.service.resetAdminPassword(id, dto.newPassword);
  }

  @Patch(':id/logo')
  @PlatformRoles('super_admin', 'admin')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, _file, callback) => {
          const directory = join(
            process.cwd(),
            'uploads',
            'organizations',
            req.params.id,
          );
          mkdirSync(directory, { recursive: true });
          callback(null, directory);
        },
        filename: (_req, file, callback) => {
          const extensions: Record<string, string> = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
          };
          const extension =
            extensions[file.mimetype] ||
            extname(file.originalname).toLowerCase();
          callback(null, `logo-${Date.now()}${extension}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        callback(null, allowedTypes.includes(file.mimetype));
      },
    }),
  )
  @ApiOperation({ summary: 'Upload organization logo' })
  @ApiOkResponse({ description: 'Organization logo uploaded' })
  uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file?: { filename: string },
  ) {
    if (!file) {
      throw new BadRequestException('ملف الشعار مطلوب أو نوعه غير مدعوم');
    }

    return this.service.updateLogo(
      id,
      `/uploads/organizations/${id}/${file.filename}`,
    );
  }

  @Delete(':id')
  @PlatformRoles('super_admin')
  @ApiOperation({ summary: 'Delete organization' })
  @ApiOkResponse({ description: 'Organization deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
