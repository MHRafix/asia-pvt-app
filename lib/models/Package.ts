import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPackage extends Document {
  id: string;
  title: string;
  location: string;
  image: string;
  price: number;
  duration: string;
  groupSize: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: { day: number; title: string; description: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a package title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: String,
      required: [true, 'Please provide duration'],
    },
    groupSize: {
      type: String,
      required: [true, 'Please provide group size'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    highlights: [{
      type: String,
    }],
    included: [{
      type: String,
    }],
    notIncluded: [{
      type: String,
    }],
    itinerary: [{
      day: Number,
      title: String,
      description: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
