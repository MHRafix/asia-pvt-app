import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: Date;
  preferredTime: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Please select a service'],
    },
    preferredDate: {
      type: Date,
      required: [true, 'Please provide a preferred date'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Please provide a preferred time'],
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>('Appointment', AppointmentSchema);
