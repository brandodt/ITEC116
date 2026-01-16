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
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, CheckInDto } from './dto';
import { TicketStatus } from './schemas/ticket.schema';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // ========== PUBLIC REGISTRATION ==========

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register for an event (public or authenticated)' })
  register(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user?: UserDocument,
  ) {
    return this.ticketsService.register(createTicketDto, user?._id?.toString());
  }

  // ========== ATTENDEE ROUTES ==========

  @Get('my-tickets')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user tickets' })
  getMyTickets(@CurrentUser() user: UserDocument) {
    return this.ticketsService.findByUser(user._id.toString(), user.email);
  }

  @Get('my-stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get attendee ticket statistics' })
  getMyStats(@CurrentUser() user: UserDocument) {
    return this.ticketsService.getAttendeeStats(user._id.toString(), user.email);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update ticket details (owner only)' })
  update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.ticketsService.update(
      id,
      updateTicketDto,
      user._id.toString(),
      user.role,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel ticket (owner only)' })
  cancel(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.ticketsService.cancel(id, user._id.toString(), user.role);
  }

  // ========== ORGANIZER ROUTES ==========

  @Get('event/:eventId')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all tickets for an event (Organizer/Admin)' })
  getEventTickets(@Param('eventId') eventId: string) {
    return this.ticketsService.findByEvent(eventId);
  }

  @Get('event/:eventId/attendees')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get event attendees with statistics' })
  getEventAttendees(@Param('eventId') eventId: string) {
    return this.ticketsService.getEventAttendees(eventId);
  }

  @Post('check-in')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Check in attendee by QR code' })
  checkIn(@Body() checkInDto: CheckInDto, @CurrentUser() user: UserDocument) {
    return this.ticketsService.checkIn(checkInDto.qrCode, user.name);
  }

  @Get('qr/:qrCode')
  @ApiBearerAuth()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get ticket by QR code' })
  getByQRCode(@Param('qrCode') qrCode: string) {
    return this.ticketsService.findByQRCode(qrCode);
  }

  // ========== ADMIN ROUTES ==========

  @Get()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get all tickets (Admin only)' })
  @ApiQuery({ name: 'eventId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  @ApiQuery({ name: 'email', required: false })
  findAll(
    @Query('eventId') eventId?: string,
    @Query('status') status?: TicketStatus,
    @Query('email') attendeeEmail?: string,
  ) {
    return this.ticketsService.findAll({ eventId, status, attendeeEmail });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ticket by ID' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }
}
