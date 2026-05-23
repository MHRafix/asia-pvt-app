import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IClientTransaction extends Document {
	clientId: Types.ObjectId;
	type: 'service' | 'package' | 'payment' | 'refund' | 'adjustment';
	serviceId?: Types.ObjectId;
	packageId?: Types.ObjectId;
	serviceName?: string;
	packageName?: string;
	description: string;
	amount: number;
	status: 'pending' | 'completed' | 'cancelled';
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const ClientTransactionSchema = new Schema<IClientTransaction>(
	{
		clientId: {
			type: Schema.Types.ObjectId,
			ref: 'Client',
			required: [true, 'Client ID is required'],
		},
		type: {
			type: String,
			enum: ['service', 'package', 'payment', 'refund', 'adjustment'],
			required: [true, 'Transaction type is required'],
		},
		serviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Service',
		},
		packageId: {
			type: Schema.Types.ObjectId,
			ref: 'Package',
		},
		serviceName: {
			type: String,
		},
		packageName: {
			type: String,
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
		},
		amount: {
			type: Number,
			required: [true, 'Amount is required'],
		},
		status: {
			type: String,
			enum: ['pending', 'completed', 'cancelled'],
			default: 'pending',
		},
		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Index for efficient queries
ClientTransactionSchema.index({ clientId: 1, createdAt: -1 });

export const ClientTransaction: Model<IClientTransaction> =
	mongoose.models.ClientTransaction ||
	mongoose.model<IClientTransaction>('ClientTransaction', ClientTransactionSchema);
