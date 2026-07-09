import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IInvoice extends Document {
	invoiceNumber: string;
	clientId: Types.ObjectId;
	linkedServiceId?: Types.ObjectId;
	subTotal: number;
	discount?: number;
	grandTotal: number;
	paidAmount?: number;
	dueAmount?: number;
	status: 'paid' | 'due' | 'partial' | 'failed' | 'refunded';
	createdAt: Date;
	updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
	{
		invoiceNumber: {
			type: String,
			required: [true, 'Invoice number is required'],
			unique: true,
			index: true,
		},
		clientId: {
			type: Schema.Types.ObjectId,
			ref: 'Client',
			required: [true, 'Client ID is required'],
		},
		linkedServiceId: {
			type: Schema.Types.ObjectId,
			ref: 'DailyService',
		},

		subTotal: {
			type: Number,
			required: [true, 'Sub total is required'],
			default: 0,
		},

		discount: {
			type: Number,
			default: 0,
		},
		grandTotal: {
			type: Number,
			required: [true, 'Grand total is required'],
			default: 0,
		},
		dueAmount: {
			type: Number,
			default: 0,
		},
		paidAmount: {
			type: Number,
			default: 0,
		},

		status: {
			type: String,
			enum: ['paid', 'due', 'partial', 'failed', 'refunded'],
			default: 'due',
		},
	},
	{
		timestamps: true,
	},
);

// Index for efficient queries
InvoiceSchema.index({ clientId: 1, createdAt: -1 });
InvoiceSchema.index({ transactionStatus: 1, paymentDate: -1 });
InvoiceSchema.index({ invoiceNumber: 1 });

export const Invoice: Model<IInvoice> =
	mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
