import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument, EventStatus } from './schemas/event.schema';
import { CreateEventDto, UpdateEventDto } from './dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

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
  }): Promise<EventDocument[]> {
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

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

    return this.eventModel.find(query).sort({ date: 1 }).exec();
  }

  /**
   * Find public events for attendees
   */
  async findPublicEvents(filters?: {
    category?: string;
    search?: string;
  }): Promise<EventDocument[]> {
    const query: any = {
      isPublic: true,
      status: { $in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
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

    return this.eventModel.find(query).sort({ date: 1 }).exec();
  }

  /**
   * Find event by ID
   */
  async findById(id: string): Promise<EventDocument> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  /**
   * Find events by organizer
   */
  async findByOrganizer(organizerId: string): Promise<EventDocument[]> {
    return this.eventModel
      .find({ organizerId: new Types.ObjectId(organizerId) })
      .sort({ date: -1 })
      .exec();
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
