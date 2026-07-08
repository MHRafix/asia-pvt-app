import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IInvoice extends Document {
	invoiceNumber: string;
	clientId: Types.ObjectId;
	linkedServiceId?: Types.ObjectId;
	linkedTransactionId?: Types.ObjectId;
	amount: number;
	paymentDate: Date;
	paymentMethod: 'cash' | 'check' | 'bank_transfer' | 'card' | 'other';
	transactionStatus: 'paid' | 'pending' | 'partial' | 'failed' | 'refunded';
	description?: string;
	notes?: string;
	pdfPath?: string;
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
		linkedTransactionId: {
			type: Schema.Types.ObjectId,
			ref: 'ClientTransaction',
		},
		amount: {
			type: Number,
			required: [true, 'Amount is required'],
			default: 0,
		},
		paymentDate: {
			type: Date,
			required: [true, 'Payment date is required'],
			default: Date.now,
		},
		paymentMethod: {
			type: String,
			enum: ['cash', 'check', 'bank_transfer', 'card', 'other'],
			required: [true, 'Payment method is required'],
		},
		transactionStatus: {
			type: String,
			enum: ['paid', 'pending', 'partial', 'failed', 'refunded'],
			default: 'pending',
		},
		description: {
			type: String,
			trim: true,
		},
		notes: {
			type: String,
		},
		pdfPath: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Index for efficient queries
InvoiceSchema.index({ clientId: 1, createdAt: -1 });
InvoiceSchema.index({ transactionStatus: 1, paymentDate: -1 });
InvoiceSchema.index({ invoiceNumber: 1 });

export const Invoice: Model<IInvoice> =
	mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
