import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IClient extends Document {
	name: string;
	email: string;
	phone: string;
	address?: string;
	company?: string;
	notes?: string;
	status: 'active' | 'inactive' | 'prospect' | 'vip';
	source?: string;
	tags: string[];
	balance: number;
	totalSpent: number;
	totalServices: number;
	totalPackages: number;
	lastActivityDate?: Date;
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
			required: [true, 'Email is required'],
			unique: true,
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
		address: {
			type: String,
			trim: true,
		},
		company: {
			type: String,
			trim: true,
		},
		notes: {
			type: String,
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'prospect', 'vip'],
			default: 'prospect',
		},
		source: {
			type: String,
			trim: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		balance: {
			type: Number,
			default: 0,
		},
		totalSpent: {
			type: Number,
			default: 0,
		},
		totalServices: {
			type: Number,
			default: 0,
		},
		totalPackages: {
			type: Number,
			default: 0,
		},
		lastActivityDate: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

// Index for search
ClientSchema.index({ name: 'text', email: 'text', company: 'text' });

export const Client: Model<IClient> =
	mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
