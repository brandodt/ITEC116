import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';
import { Ticket, TicketDocument } from '../tickets/schemas/ticket.schema';
import { CreateEventDto, UpdateEventDto } from './dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  /**
   * Parse time string to hours and minutes
   * Handles both 24-hour format ("14:00") and 12-hour format ("02:00 PM")
   */
  private parseTimeString(timeStr: string): { hours: number; minutes: number } {
    if (!timeStr) {
      return { hours: 0, minutes: 0 };
    }
    
    const trimmed = timeStr.trim().toUpperCase();
    
    // Check for 12-hour format (e.g., "02:00 PM", "2:00 AM")
    const match12Hour = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (match12Hour) {
      let hours = parseInt(match12Hour[1], 10);
      const minutes = parseInt(match12Hour[2], 10);
      const period = match12Hour[3];
      
      // Convert to 24-hour format
      if (period === 'PM' && hours !== 12) {
        hours += 12;
      } else if (period === 'AM' && hours === 12) {
        hours = 0;
      }
      
      return { hours, minutes };
    }
    
    // 24-hour format (e.g., "14:00")
    const [hoursStr, minutesStr] = trimmed.split(':');
    return {
      hours: parseInt(hoursStr, 10) || 0,
      minutes: parseInt(minutesStr, 10) || 0,
    };
  }

  /**
   * Calculate the current status of an event based on date/time
   */
  private calculateEventStatus(event: EventDocument): EventStatus {
    // If manually cancelled, keep that status
    if (event.status === EventStatus.CANCELLED) {
      return EventStatus.CANCELLED;
    }

    const now = new Date();
    const eventDate = new Date(event.date);
    
    // Parse start time (handles both "14:00" and "02:00 PM")
    if (event.time) {
      const { hours, minutes } = this.parseTimeString(event.time);
      eventDate.setHours(hours, minutes, 0, 0);
    } else {
      eventDate.setHours(0, 0, 0, 0);
    }

    // Calculate end datetime
    let endDateTime: Date;
    if (event.endDate) {
      endDateTime = new Date(event.endDate);
    } else {
      endDateTime = new Date(event.date);
    }
    
    if (event.endTime) {
      const { hours, minutes } = this.parseTimeString(event.endTime);
      endDateTime.setHours(hours, minutes, 0, 0);
    } else if (!event.endDate) {
      // If no end time and no end date, assume event ends at end of day
      endDateTime.setHours(23, 59, 59, 999);
    }

    // Determine status based on current time
    if (now < eventDate) {
      return EventStatus.UPCOMING;
    } else if (now >= eventDate && now <= endDateTime) {
      return EventStatus.ONGOING;
    } else {
      return EventStatus.COMPLETED;
    }
  }

  /**
   * Add calculated status to event document
   */
  private enrichEventWithStatus(event: EventDocument): EventDocument & { calculatedStatus: EventStatus } {
    const calculatedStatus = this.calculateEventStatus(event);
    const enriched = event.toObject ? event.toObject() : { ...event };
    return {
      ...enriched,
      status: calculatedStatus,
      calculatedStatus,
    } as EventDocument & { calculatedStatus: EventStatus };
  }

  /**
   * Create a new event
   */
  async create(
    createEventDto: CreateEventDto,
    organizerId: string,
    organizerName: string,
  ): Promise<EventDocument> {
    const event = new this.eventModel({
      ...createEventDto,
      organizerId: new Types.ObjectId(organizerId),
      organizerName,
      ticketTypes: createEventDto.ticketTypes || ['General Admission'],
    });

    return event.save();
  }

  /**
   * Find all events (with filters)
   */
  async findAll(filters?: {
    status?: EventStatus;
    category?: string;
    organizerId?: string;
    isPublic?: boolean;
    search?: string;
  }): Promise<(EventDocument & { calculatedStatus: EventStatus })[]> {
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.organizerId) {
      query.organizerId = new Types.ObjectId(filters.organizerId);
    }

    if (filters?.isPublic !== undefined) {
      query.isPublic = filters.isPublic;
    }

    if (filters?.search) {
      query.$text = { $search: filters.search };
    }

    const events = await this.eventModel.find(query).sort({ date: 1 }).exec();
    
    // Enrich with calculated status and filter by status if provided
    let enrichedEvents = events.map(e => this.enrichEventWithStatus(e));
    
    if (filters?.status) {
      enrichedEvents = enrichedEvents.filter(e => e.calculatedStatus === filters.status);
    }
    
    return enrichedEvents;
  }

  /**
   * Find public events for attendees (with status filtering)
   */
  async findPublicEvents(filters?: {
    category?: string;
    search?: string;
    status?: string;
    featured?: boolean;
  }): Promise<(EventDocument & { calculatedStatus: EventStatus })[]> {
    const query: any = {
      isPublic: true,
    };

    if (filters?.category) {
      // Case-insensitive category matching
      query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
    }

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Filter by featured if requested
    if (filters?.featured === true) {
      query.isFeatured = true;
    }

    const events = await this.eventModel.find(query).sort({ date: 1 }).exec();
    
    // Enrich with calculated status
    let enrichedEvents = events.map(e => this.enrichEventWithStatus(e));
    
    // Filter by status if provided
    if (filters?.status) {
      const statusLower = filters.status.toLowerCase();
      enrichedEvents = enrichedEvents.filter(e => e.calculatedStatus === statusLower);
    } else {
      // Default: only show upcoming and ongoing (hide completed/cancelled)
      enrichedEvents = enrichedEvents.filter(e => 
        e.calculatedStatus === EventStatus.UPCOMING || 
        e.calculatedStatus === EventStatus.ONGOING
      );
    }
    
    return enrichedEvents;
  }

  /**
   * Find event by ID
   */
  async findById(id: string): Promise<EventDocument & { calculatedStatus: EventStatus }> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.enrichEventWithStatus(event);
  }

  /**
   * Find events by organizer
   */
  async findByOrganizer(organizerId: string): Promise<(EventDocument & { calculatedStatus: EventStatus })[]> {
    const events = await this.eventModel
      .find({ organizerId: new Types.ObjectId(organizerId) })
      .sort({ date: -1 })
      .exec();
    
    return events.map(e => this.enrichEventWithStatus(e));
  }

  /**
   * Update event
   */
  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
    userRole: Role,
  ): Promise<EventDocument> {
    const event = await this.findById(id);

    // Check ownership (admins can update any event)
    if (userRole !== Role.ADMIN && event.organizerId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own events');
    }

    const updated = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();

    // Update all tickets for this event with new event details
    const ticketUpdates: any = {};
    if (updateEventDto.name) ticketUpdates.eventName = updateEventDto.name;
    if (updateEventDto.date) ticketUpdates.eventDate = updateEventDto.date;
    if (updateEventDto.time) ticketUpdates.eventTime = updateEventDto.time;
    if (updateEventDto.location) ticketUpdates.eventLocation = updateEventDto.location;
    if (updateEventDto.imageUrl) ticketUpdates.eventImage = updateEventDto.imageUrl;

    if (Object.keys(ticketUpdates).length > 0) {
      await this.ticketModel.updateMany(
        { eventId: new Types.ObjectId(id) },
        { $set: ticketUpdates },
      );
    }

    return updated!;
  }

  /**
   * Delete event
   */
  async remove(id: string, userId: string, userRole: Role): Promise<void> {
    const event = await this.findById(id);

    // Check ownership (admins can delete any event)
    if (userRole !== Role.ADMIN && event.organizerId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    await this.eventModel.findByIdAndDelete(id).exec();
  }

  /**
   * Increment registration count
   */
  async incrementRegistration(eventId: string): Promise<void> {
    await this.eventModel
      .findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } })
      .exec();
  }

  /**
   * Decrement registration count
   */
  async decrementRegistration(eventId: string): Promise<void> {
    await this.eventModel
      .findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } })
      .exec();
  }

  /**
   * Increment check-in count
   */
  async incrementCheckIn(eventId: string): Promise<void> {
    await this.eventModel
      .findByIdAndUpdate(eventId, { $inc: { checkedInCount: 1 } })
      .exec();
  }

  /**
   * Get event statistics for organizer dashboard
   */
  async getOrganizerStats(organizerId: string) {
    const events = await this.findByOrganizer(organizerId);

    const now = new Date();
    const stats = {
      totalEvents: events.length,
      upcomingEvents: 0,
      completedEvents: 0,
      totalRegistrations: 0,
      totalCheckIns: 0,
      checkInRate: 0,
    };

    events.forEach((event) => {
      if (event.status === EventStatus.UPCOMING || new Date(event.date) > now) {
        stats.upcomingEvents++;
      }
      if (event.status === EventStatus.COMPLETED) {
        stats.completedEvents++;
      }
      stats.totalRegistrations += event.registeredCount;
      stats.totalCheckIns += event.checkedInCount;
    });

    if (stats.totalRegistrations > 0) {
      stats.checkInRate = Math.round(
        (stats.totalCheckIns / stats.totalRegistrations) * 100,
      );
    }

    return stats;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const categories = await this.eventModel.distinct('category').exec();
    return categories.filter((c) => c); // Remove null/undefined
  }
}
