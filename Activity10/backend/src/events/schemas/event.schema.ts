import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

/**
 * Event Status Enum
 */
export enum EventStatus {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Event Schema
 * Represents events created by organizers
 */
@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  time?: string;

  @Prop()
  endTime?: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  address?: string;

  @Prop()
  category?: string;

  @Prop({ default: 100 })
  capacity: number;

  @Prop({ default: 0 })
  registeredCount: number;

  @Prop({ default: 0 })
  checkedInCount: number;

  @Prop({ type: String, enum: EventStatus, default: EventStatus.UPCOMING })
  status: EventStatus;

  @Prop()
  imageUrl?: string;

  @Prop()
  coverImage?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  organizerId: Types.ObjectId;

  @Prop()
  organizerName?: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: false })
  requiresApproval: boolean;

  @Prop({ type: [String], default: [] })
  ticketTypes: string[];

  @Prop({ type: Object, default: {} })
  ticketPrices: Record<string, number>;

  @Prop({ default: 0 })
  price: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Indexes
EventSchema.index({ organizerId: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ date: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ name: 'text', description: 'text' });
