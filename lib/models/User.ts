import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	phone: string;
	role: 'admin' | 'user' | 'employee';
	avatar?: string;
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: [true, 'Please provide a name'],
			trim: true,
			maxlength: [50, 'Name cannot exceed 50 characters'],
		},
		email: {
			type: String,
			required: [true, 'Please provide an email'],
			unique: true,
			lowercase: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Please provide a valid email',
			],
		},
		password: {
			type: String,
			required: [true, 'Please provide a password'],
			minlength: 6,
			select: false,
		},
		phone: {
			type: String,
			required: [true, 'Please provide a phone number'],
			trim: true,
		},
		role: {
			type: String,
			enum: ['admin', 'user', 'employee'],
			default: 'user',
		},

		avatar: {
			type: String,
		},

		resetPasswordToken: {
			type: String,
			select: false,
			default: null,
		},
		resetPasswordExpires: {
			type: Date,
			select: false,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

export const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
