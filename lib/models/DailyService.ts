import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IDailyService extends Document {
	serviceId: string;
	linkedClientId: Types.ObjectId;
	assignedEmployeeId: Types.ObjectId;
	createdBy: Types.ObjectId;
	serviceRefId: Types.ObjectId;
	serviceTitle: string;
	serviceDescription?: string;
	serviceCost: number;
	serviceStatus:
		| 'pending'
		| 'in_progress'
		| 'completed'
		| 'cancelled'
		| 'on_hold';
	createdDate: Date;
	passportNo: string;
	completedDate?: Date;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const DailyServiceSchema = new Schema<IDailyService>(
	{
		serviceId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},

		linkedClientId: {
			type: Schema.Types.ObjectId,
			ref: 'Client',
			required: true,
		},

		assignedEmployeeId: {
			type: Schema.Types.ObjectId,
			ref: 'Employee',
			required: true,
		},

		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: false,
		},

		serviceRefId: {
			type: Schema.Types.ObjectId,
			ref: 'Service',
			required: true,
		},

		serviceTitle: {
			type: String,
			required: true,
			trim: true,
			maxlength: 150,
		},

		passportNo: {
			type: String,
		},

		serviceDescription: {
			type: String,
			trim: true,
		},

		serviceCost: {
			type: Number,
			required: true,
			default: 0,
		},

		serviceStatus: {
			type: String,
			enum: ['pending', 'in_progress', 'completed', 'cancelled', 'on_hold'],
			default: 'pending',
		},

		createdDate: {
			type: Date,
			required: true,
			default: Date.now,
		},

		completedDate: {
			type: Date,
		},

		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

DailyServiceSchema.index({ linkedClientId: 1, createdDate: -1 });
DailyServiceSchema.index({ assignedEmployeeId: 1, serviceStatus: 1 });
DailyServiceSchema.index({ serviceRefId: 1, serviceStatus: 1 });
DailyServiceSchema.index({ serviceStatus: 1, createdDate: -1 });

export const DailyService: Model<IDailyService> =
	mongoose.models.DailyService ||
	mongoose.model<IDailyService>('DailyService', DailyServiceSchema);
