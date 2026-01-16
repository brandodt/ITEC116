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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventStatus } from './schemas/event.schema';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ========== PUBLIC ROUTES ==========

  @Get('public')
  @Public()
  @ApiOperation({ summary: 'Get all public events (for attendees)' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status: UPCOMING, ONGOING, COMPLETED' })
  @ApiQuery({ name: 'featured', required: false, description: 'Filter featured events only' })
  findPublic(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('featured') featured?: string,
  ) {
    return this.eventsService.findPublicEvents({ 
      category, 
      search, 
      status,
      featured: featured === 'true',
    });
  }

  @Get('public/:id')
  @Public()
  @ApiOperation({ summary: 'Get public event by ID' })
  findPublicOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get all event categories' })
  getCategories() {
    return this.eventsService.getCategories();
  }

  // ========== ORGANIZER ROUTES ==========

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a new event (Organizer/Admin)' })
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: UserDocument) {
    return this.eventsService.create(
      createEventDto,
      user._id.toString(),
      user.name,
    );
  }

  @Get('my-events')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get events created by current organizer' })
  findMyEvents(@CurrentUser() user: UserDocument) {
    return this.eventsService.findByOrganizer(user._id.toString());
  }

  @Get('my-stats')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get organizer dashboard statistics' })
  getMyStats(@CurrentUser() user: UserDocument) {
    return this.eventsService.getOrganizerStats(user._id.toString());
  }

  // ========== ADMIN ROUTES ==========

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all events (Admin only)' })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'organizerId', required: false })
  findAll(
    @Query('status') status?: EventStatus,
    @Query('category') category?: string,
    @Query('organizerId') organizerId?: string,
  ) {
    return this.eventsService.findAll({ status, category, organizerId });
  }

  // ========== SHARED AUTHENTICATED ROUTES ==========

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event by ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update event (owner or Admin)' })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.eventsService.update(
      id,
      updateEventDto,
      user._id.toString(),
      user.role,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete event (owner or Admin)' })
  remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.eventsService.remove(id, user._id.toString(), user.role);
  }
}
