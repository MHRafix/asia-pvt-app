import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IService extends Document {
	slug: string;
	title: string;
	description: string;
	longDescription: string;
	features: string[];
	process: { step: number; title: string; description: string }[];
	createdAt: Date;
	updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
	{
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		title: {
			type: String,
			required: [true, 'Please provide a service title'],
			trim: true,
			maxlength: [100, 'Title cannot exceed 100 characters'],
		},
		description: {
			type: String,
			required: [true, 'Please provide a short description'],
		},

		longDescription: {
			type: String,
			required: [true, 'Please provide a detailed description'],
		},
		features: [
			{
				type: String,
			},
		],
		process: [
			{
				step: Number,
				title: String,
				description: String,
			},
		],
	},
	{
		timestamps: true,
	},
);

export const Service: Model<IService> =
	mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
