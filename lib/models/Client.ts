import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IClient extends Document {
	name: string;
	email?: string;
	phone: string;
	profession?: string;
	notes?: string;
	status: 'new' | 'follow up' | 'active' | 'star';
	source?: string;
	totalSpent: number;
	totalServices: number;
	createdAt: Date;
	updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
	{
		name: {
			type: String,
			required: [true, 'Client name is required'],
			trim: true,
			maxlength: [100, 'Name cannot exceed 100 characters'],
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Please provide a valid email',
			],
		},
		phone: {
			type: String,
			required: [true, 'Phone number is required'],
			trim: true,
		},

		profession: {
			type: String,
			trim: true,
		},
		notes: {
			type: String,
		},

		status: {
			type: String,
			enum: ['new', 'follow up', 'active', 'star'],
			default: 'new',
		},

		source: {
			type: String,
			trim: true,
		},

		totalSpent: {
			type: Number,
			default: 0,
		},
		totalServices: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

// Index for search
ClientSchema.index({ name: 'text', phone: 'text', email: 'text' });

export const Client: Model<IClient> =
	mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
