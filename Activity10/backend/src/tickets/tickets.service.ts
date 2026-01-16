import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument, TicketStatus } from './schemas/ticket.schema';
import { CreateTicketDto, UpdateTicketDto } from './dto';
import { EventsService } from '../events/events.service';
import { EventStatus } from '../events/schemas/event.schema';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    private eventsService: EventsService,
  ) {}

  /**
   * Generate unique QR code
   */
  private generateQRCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'TKT-';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Generate confirmation token
   */
  private generateConfirmationToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  /**
   * Register for an event (create ticket)
   */
  async register(
    createTicketDto: CreateTicketDto,
    userId?: string,
  ): Promise<TicketDocument> {
    const { eventId, attendeeEmail } = createTicketDto;

    // Get event details
    const event = await this.eventsService.findById(eventId);

    // Check if event is open for registration
    if (
      event.status !== EventStatus.UPCOMING &&
      event.status !== EventStatus.ONGOING
    ) {
      throw new BadRequestException('This event is not open for registration');
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      throw new BadRequestException('This event is at full capacity');
    }

    // Check for duplicate registration (any non-cancelled ticket with same email)
    const existingTicket = await this.ticketModel.findOne({
      eventId: new Types.ObjectId(eventId),
      attendeeEmail: attendeeEmail.toLowerCase(),
      status: { $ne: TicketStatus.CANCELLED },
    });

    if (existingTicket) {
      throw new ConflictException(
        'This email is already registered for this event',
      );
    }

    // Validate ticket type
    const ticketType = createTicketDto.ticketType || 'General Admission';
    if (event.ticketTypes.length > 0 && !event.ticketTypes.includes(ticketType)) {
      throw new BadRequestException(`Invalid ticket type: ${ticketType}`);
    }

    // Generate unique QR code
    let qrCode = this.generateQRCode();
    let attempts = 0;
    while (await this.ticketModel.findOne({ qrCode })) {
      qrCode = this.generateQRCode();
      attempts++;
      if (attempts > 10) {
        throw new BadRequestException('Failed to generate unique QR code');
      }
    }

    // Create ticket - all registrations are immediately valid
    const ticket = new this.ticketModel({
      ...createTicketDto,
      eventId: new Types.ObjectId(eventId),
      eventName: event.name,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventImage: event.imageUrl,
      userId: userId ? new Types.ObjectId(userId) : undefined,
      ticketType,
      qrCode,
      status: TicketStatus.VALID,
      confirmedAt: new Date(),
    });

    await ticket.save();

    // Increment registration count
    await this.eventsService.incrementRegistration(eventId);

    return ticket;
  }

  /**
   * Confirm ticket registration via email token
   */
  async confirmRegistration(token: string): Promise<{ ticket: TicketDocument; message: string }> {
    const ticket = await this.ticketModel.findOne({ confirmationToken: token });

    if (!ticket) {
      throw new NotFoundException('Invalid or expired confirmation token');
    }

    if (ticket.status !== TicketStatus.PENDING) {
      return {
        ticket,
        message: 'This ticket has already been confirmed',
      };
    }

    ticket.status = TicketStatus.VALID;
    ticket.confirmedAt = new Date();
    ticket.confirmationToken = undefined; // Clear the token
    await ticket.save();

    // Now increment the registration count
    await this.eventsService.incrementRegistration(ticket.eventId.toString());

    return {
      ticket,
      message: 'Registration confirmed successfully! Your ticket is now valid.',
    };
  }

  /**
   * Find all tickets (with filters)
   */
  async findAll(filters?: {
    eventId?: string;
    userId?: string;
    status?: TicketStatus;
    attendeeEmail?: string;
  }): Promise<TicketDocument[]> {
    const query: any = {};

    if (filters?.eventId) {
      query.eventId = new Types.ObjectId(filters.eventId);
    }

    if (filters?.userId) {
      query.userId = new Types.ObjectId(filters.userId);
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.attendeeEmail) {
      query.attendeeEmail = filters.attendeeEmail.toLowerCase();
    }

    return this.ticketModel.find(query).sort({ createdAt: -1 }).exec();
  }

  /**
   * Find tickets by user ID or email
   */
  async findByUser(userId?: string, email?: string): Promise<TicketDocument[]> {
    const query: any = {};

    if (userId) {
      query.$or = [
        { userId: new Types.ObjectId(userId) },
        ...(email ? [{ attendeeEmail: email.toLowerCase() }] : []),
      ];
    } else if (email) {
      query.attendeeEmail = email.toLowerCase();
    }

    return this.ticketModel.find(query).sort({ eventDate: -1 }).exec();
  }

  /**
   * Find tickets by event
   */
  async findByEvent(eventId: string): Promise<TicketDocument[]> {
    return this.ticketModel
      .find({ eventId: new Types.ObjectId(eventId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Find ticket by ID
   */
  async findById(id: string): Promise<TicketDocument> {
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  /**
   * Find ticket by QR code
   */
  async findByQRCode(qrCode: string): Promise<TicketDocument> {
    const ticket = await this.ticketModel.findOne({ qrCode }).exec();
    if (!ticket) {
      throw new NotFoundException('Invalid ticket QR code');
    }
    return ticket;
  }

  /**
   * Update ticket (limited fields)
   */
  async update(
    id: string,
    updateTicketDto: UpdateTicketDto,
    userId?: string,
    userRole?: Role,
  ): Promise<TicketDocument> {
    const ticket = await this.findById(id);

    // Check ownership (unless admin/organizer)
    if (
      userRole !== Role.ADMIN &&
      userRole !== Role.ORGANIZER &&
      ticket.userId?.toString() !== userId
    ) {
      throw new ForbiddenException('You can only update your own tickets');
    }

    // Cannot update cancelled tickets
    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Cannot update cancelled tickets');
    }

    const updated = await this.ticketModel
      .findByIdAndUpdate(id, updateTicketDto, { new: true })
      .exec();

    return updated!;
  }

  /**
   * Cancel ticket
   */
  async cancel(id: string, userId?: string, userRole?: Role): Promise<TicketDocument> {
    const ticket = await this.findById(id);

    // Check ownership (unless admin/organizer)
    if (
      userRole !== Role.ADMIN &&
      userRole !== Role.ORGANIZER &&
      ticket.userId?.toString() !== userId
    ) {
      throw new ForbiddenException('You can only cancel your own tickets');
    }

    // Cannot cancel already cancelled tickets
    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('Ticket is already cancelled');
    }

    // Cannot cancel checked-in tickets
    if (ticket.checkedIn) {
      throw new BadRequestException('Cannot cancel a ticket that has been used');
    }

    ticket.status = TicketStatus.CANCELLED;
    await ticket.save();

    // Decrement event registration count
    await this.eventsService.decrementRegistration(ticket.eventId.toString());

    return ticket;
  }

  /**
   * Check in attendee
   */
  async checkIn(
    qrCode: string,
    checkedInBy: string,
  ): Promise<{ ticket: TicketDocument; message: string }> {
    const ticket = await this.findByQRCode(qrCode);

    // Check if already checked in
    if (ticket.checkedIn) {
      return {
        ticket,
        message: `Already checked in at ${ticket.checkedInAt?.toLocaleString()}`,
      };
    }

    // Check ticket status
    if (ticket.status === TicketStatus.CANCELLED) {
      throw new BadRequestException('This ticket has been cancelled');
    }

    // Fetch the current event to get the latest date (in case it was updated)
    const event = await this.eventsService.findById(ticket.eventId.toString());
    const eventDate = new Date(event.date);
    const today = new Date();
    eventDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (eventDate > today) {
      throw new BadRequestException('Event has not started yet');
    }

    // Perform check-in
    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    ticket.checkedInBy = checkedInBy;
    ticket.status = TicketStatus.USED;
    await ticket.save();

    // Increment event check-in count
    await this.eventsService.incrementCheckIn(ticket.eventId.toString());

    return {
      ticket,
      message: 'Check-in successful!',
    };
  }

  /**
   * Get attendee statistics
   */
  async getAttendeeStats(userId?: string, email?: string) {
    const tickets = await this.findByUser(userId, email);
    const now = new Date();

    const stats = {
      totalTickets: tickets.length,
      upcomingEvents: 0,
      pastEvents: 0,
      checkedInEvents: 0,
      cancelledTickets: 0,
    };

    tickets.forEach((ticket) => {
      if (ticket.status === TicketStatus.CANCELLED) {
        stats.cancelledTickets++;
      } else if (ticket.checkedIn) {
        stats.checkedInEvents++;
        stats.pastEvents++;
      } else if (new Date(ticket.eventDate) < now) {
        stats.pastEvents++;
      } else {
        stats.upcomingEvents++;
      }
    });

    return stats;
  }

  /**
   * Get event attendees with statistics
   */
  async getEventAttendees(eventId: string) {
    const allTickets = await this.findByEvent(eventId);
    
    // Only show confirmed tickets to organizers (filter out PENDING)
    const confirmedTickets = allTickets.filter((t) => t.status !== TicketStatus.PENDING);

    const stats = {
      total: confirmedTickets.length,
      checkedIn: confirmedTickets.filter((t) => t.checkedIn).length,
      pending: confirmedTickets.filter((t) => !t.checkedIn && t.status === TicketStatus.VALID).length,
      cancelled: confirmedTickets.filter((t) => t.status === TicketStatus.CANCELLED).length,
      awaitingConfirmation: allTickets.filter((t) => t.status === TicketStatus.PENDING).length,
    };

    return { tickets: confirmedTickets, stats };
  }

  /**
   * Check if email is already registered for an event (public endpoint)
   */
  async checkExistingRegistration(eventId: string, email: string): Promise<{ exists: boolean; ticketId?: string }> {
    const existingTicket = await this.ticketModel.findOne({
      eventId: new Types.ObjectId(eventId),
      attendeeEmail: email.toLowerCase(),
      status: { $ne: TicketStatus.CANCELLED },
    });

    if (existingTicket) {
      return { exists: true, ticketId: existingTicket._id.toString() };
    }
    return { exists: false };
  }
}
