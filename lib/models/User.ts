import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	phone: string;
	role: 'admin' | 'user';
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
			enum: ['admin', 'user'],
			default: 'user',
		},
		avatar: {
			type: String,
		},
		resetPasswordToken: {
			type: String,
			select: false,
		},
		resetPasswordExpires: {
			type: Date,
			select: false,
		},
	},
	{
		timestamps: true,
	},
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error as Error);
	}
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
	enteredPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
