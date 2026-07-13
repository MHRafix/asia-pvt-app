import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IClientTransaction extends Document {
	clientId: Types.ObjectId;
	invoiceId: Types.ObjectId;
	transactionId?: string;
	description?: string;
	type: 'payment' | 'refund' | 'adjustment' | 'credit';
	amount: number;
	paymentMethod: 'cash' | 'check' | 'bank' | 'card' | 'bkash' | 'other';
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
		transactionId: {
			type: String,
		},
		invoiceId: {
			type: Schema.Types.ObjectId,
			ref: 'Invoice',
			required: [true, 'Invoice is required'],
		},

		type: {
			type: String,
			enum: ['payment', 'adjustment', 'refund', 'credit'],
		},

		description: {
			type: String,
		},

		amount: {
			type: Number,
			required: [true, 'Amount is required'],
		},

		paymentMethod: {
			type: String,
			enum: ['cash', 'check', 'bank', 'card', 'bkash', 'other'],
		},
	},
	{
		timestamps: true,
	},
);

// Index for efficient queries
ClientTransactionSchema.index({ clientId: 1, createdAt: -1 });

export const ClientTransaction: Model<IClientTransaction> =
	mongoose.models.ClientTransaction ||
	mongoose.model<IClientTransaction>(
		'ClientTransaction',
		ClientTransactionSchema,
	);
