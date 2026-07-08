import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IDailyService extends Document {
	serviceId: string; // 5-character unique ID
	linkedClientId: Types.ObjectId;
	assignedEmployeeId?: Types.ObjectId;
	serviceTitle: string;
	serviceDescription?: string;
	serviceCost: number;
	serviceStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
	createdDate: Date;
	completedDate?: Date;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const DailyServiceSchema = new Schema<IDailyService>(
	{
		serviceId: {
			type: String,
			required: [true, 'Service ID is required'],
			unique: true,
			index: true,
		},
		linkedClientId: {
			type: Schema.Types.ObjectId,
			ref: 'Client',
			required: [true, 'Client ID is required'],
		},
		assignedEmployeeId: {
			type: Schema.Types.ObjectId,
			ref: 'Employee',
		},
		serviceTitle: {
			type: String,
			required: [true, 'Service title is required'],
			trim: true,
			maxlength: [150, 'Service title cannot exceed 150 characters'],
		},
		serviceDescription: {
			type: String,
			trim: true,
		},
		serviceCost: {
			type: Number,
			required: [true, 'Service cost is required'],
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
	}
);

// Index for efficient queries
DailyServiceSchema.index({ linkedClientId: 1, createdDate: -1 });
DailyServiceSchema.index({ assignedEmployeeId: 1, serviceStatus: 1 });
DailyServiceSchema.index({ serviceStatus: 1, createdDate: -1 });

export const DailyService: Model<IDailyService> =
	mongoose.models.DailyService ||
	mongoose.model<IDailyService>('DailyService', DailyServiceSchema);
