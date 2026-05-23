import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisaCountry extends Document {
  slug: string;
  name: string;
  flag: string;
  processing: string;
  type: string;
  description: string;
  requirements: string[];
  documents: string[];
  fees: { type: string; amount: string }[];
  tips: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VisaCountrySchema = new Schema<IVisaCountry>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide country name'],
      trim: true,
    },
    flag: {
      type: String,
      required: [true, 'Please provide flag emoji'],
    },
    processing: {
      type: String,
      required: [true, 'Please provide processing time'],
    },
    type: {
      type: String,
      required: [true, 'Please provide visa type'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
    },
    requirements: [
      {
        type: String,
      },
    ],
    documents: [
      {
        type: String,
      },
    ],
    fees: [
      {
        type: { type: String },
        amount: String,
      },
    ],
    tips: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const VisaCountry: Model<IVisaCountry> =
  mongoose.models.VisaCountry || mongoose.model<IVisaCountry>('VisaCountry', VisaCountrySchema);
