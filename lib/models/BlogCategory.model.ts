import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlogCategorySchema extends Document {
	title: string;
	createdAt: Date;
	updatedAt: Date;
}

const BlogCategorySchema = new Schema<IBlogCategorySchema>(
	{
		title: {
			type: String,
			required: [true, 'Please provide a category title'],
			trim: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	},
);

export const BlogCategory: Model<IBlogCategorySchema> =
	mongoose.models.BlogCategory ||
	mongoose.model<IBlogCategorySchema>('BlogCategory', BlogCategorySchema);
