import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IClientActivity extends Document {
	clientId: Types.ObjectId;
	type: 'note' | 'call' | 'meeting' | 'email' | 'other' | 'status_change' | 'transaction';
	title: string;
	description?: string;
	metadata?: Record<string, any>;
	createdBy?: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const ClientActivitySchema = new Schema<IClientActivity>(
	{
		clientId: {
			type: Schema.Types.ObjectId,
			ref: 'Client',
			required: [true, 'Client ID is required'],
		},
		type: {
			type: String,
			enum: ['note', 'call', 'meeting', 'email', 'other', 'status_change', 'transaction'],
			required: [true, 'Activity type is required'],
		},
		title: {
			type: String,
			required: [true, 'Title is required'],
		},
		description: {
			type: String,
		},
		metadata: {
			type: Schema.Types.Mixed,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

// Index for efficient queries
ClientActivitySchema.index({ clientId: 1, createdAt: -1 });

export const ClientActivity: Model<IClientActivity> =
	mongoose.models.ClientActivity ||
	mongoose.model<IClientActivity>('ClientActivity', ClientActivitySchema);
