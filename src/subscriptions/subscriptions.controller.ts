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
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  ExtendSubscriptionDto,
  UpdateSubscriptionStatusDto,
} from './dto/subscription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards';
import { PlatformRoles } from '../common/decorators';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiCreatedResponse({ description: 'Subscription created successfully' })
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(dto);
  }

  @Get()
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get all subscriptions' })
  @ApiOkResponse({ description: 'Paginated list of subscriptions' })
  findAll(@Query() p: PaginationDto) {
    return this.subscriptionsService.findAll(p);
  }

  @Get(':id')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Get subscription by id' })
  @ApiOkResponse({ description: 'Subscription details' })
  @ApiNotFoundResponse({ description: 'Subscription not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Update subscription' })
  @ApiOkResponse({ description: 'Subscription updated' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, dto);
  }

  @Patch(':id/status')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Update subscription status' })
  @ApiOkResponse({ description: 'Subscription status updated' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubscriptionStatusDto,
  ) {
    return this.subscriptionsService.updateStatus(id, dto);
  }

  @Patch(':id/extend')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Extend subscription end date' })
  @ApiOkResponse({
    description: 'Subscription extended, status reset to active',
  })
  extend(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ExtendSubscriptionDto,
  ) {
    return this.subscriptionsService.extend(id, dto);
  }

  @Patch(':id/pause')
  @PlatformRoles('super_admin', 'admin')
  @ApiOperation({ summary: 'Pause subscription' })
  @ApiOkResponse({ description: 'Subscription paused' })
  pause(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.pause(id);
  }

  @Delete(':id')
  @PlatformRoles('super_admin')
  @ApiOperation({ summary: 'Delete subscription' })
  @ApiOkResponse({ description: 'Subscription deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subscriptionsService.remove(id);
  }
}
