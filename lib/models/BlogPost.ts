import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Please provide a date'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
