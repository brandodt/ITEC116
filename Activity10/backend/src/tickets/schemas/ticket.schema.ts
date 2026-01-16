import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketDocument = Ticket & Document;

/**
 * Ticket Status Enum
 */
export enum TicketStatus {
  PENDING = 'pending',  // Awaiting email confirmation (guest registrations)
  VALID = 'valid',
  USED = 'used',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * Ticket Schema
 * Represents event registrations/tickets
 */
@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop()
  eventTime?: string;

  @Prop()
  eventLocation?: string;

  @Prop()
  eventImage?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  attendeeName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  attendeeEmail: string;

  @Prop()
  phone?: string;

  @Prop({ default: 'Standard' })
  ticketType: string;

  @Prop({ type: String, enum: TicketStatus, default: TicketStatus.VALID })
  status: TicketStatus;

  @Prop({ unique: true, required: true })
  qrCode: string;

  @Prop({ default: false })
  checkedIn: boolean;

  @Prop()
  checkedInAt?: Date;

  @Prop()
  checkedInBy?: string;

  @Prop()
  company?: string;

  @Prop()
  specialRequirements?: string;

  @Prop()
  notes?: string;

  @Prop()
  confirmationToken?: string;  // Token for email confirmation

  @Prop()
  confirmedAt?: Date;  // When the ticket was confirmed
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Indexes
TicketSchema.index({ eventId: 1 });
TicketSchema.index({ userId: 1 });
TicketSchema.index({ attendeeEmail: 1 });
TicketSchema.index({ qrCode: 1 }, { unique: true });
TicketSchema.index({ eventId: 1, attendeeEmail: 1 }); // For duplicate check
