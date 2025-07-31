import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  submissions: mongoose.Types.ObjectId[];
  createdAt: Date;
  gender?: Gender;
  location?: string;
  birthday?: string;
  summary?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  work?: string;
  education?: string;
  skills?: string[];

  // Fields for password reset
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  },
  submissions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  gender: {
    type: String,
    enum: Object.values(Gender),
  },
  location: String,
  birthday: String,
  summary: String,
  website: String,
  github: String,
  linkedin: String,
  twitter: String,
  work: String,
  education: String,
  skills: [String],

  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
