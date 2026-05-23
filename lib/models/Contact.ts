import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
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
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'replied', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
