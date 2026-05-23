import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEmployee extends Document {
	name: string;
	email: string;
	phone: string;
	role: 'admin' | 'employee';
	department?: string;
	position: string;
	salary?: number;
	status: 'active' | 'inactive' | 'on-leave';
	joinDate?: Date;
	address?: string;
	emergencyContact?: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
	{
		name: {
			type: String,
			required: [true, 'Employee name is required'],
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
		role: {
			type: String,
			enum: ['admin', 'employee'],
			default: 'employee',
		},
		department: {
			type: String,
			trim: true,
		},
		position: {
			type: String,
			required: [true, 'Position is required'],
			trim: true,
		},
		salary: {
			type: Number,
			min: 0,
		},
		status: {
			type: String,
			enum: ['active', 'inactive', 'on-leave'],
			default: 'active',
		},
		joinDate: {
			type: Date,
			default: Date.now,
		},
		address: {
			type: String,
			trim: true,
		},
		emergencyContact: {
			type: String,
			trim: true,
		},
		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Index for search
EmployeeSchema.index({ name: 'text', email: 'text', position: 'text' });

export const Employee: Model<IEmployee> =
	mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
