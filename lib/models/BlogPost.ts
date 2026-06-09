import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IBlogPost extends Document {
	title: string;
	excerpt: string;
	content: string;
	image: string;
	author: Types.ObjectId | string;
	category: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
	{
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
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide an author'],
		},
		category: {
			type: String,
			required: [true, 'Please provide a blog category'],
			trim: true,
		},

		tags: [
			{
				type: String,
			},
		],
	},
	{
		timestamps: true,
	},
);

export const BlogPost: Model<IBlogPost> =
	mongoose.models.BlogPost ||
	mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
