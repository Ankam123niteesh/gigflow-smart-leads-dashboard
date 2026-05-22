import { Schema, model, type HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { UserRole } from '../types/index.js';

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserDocument {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Sales User'],
      default: 'Sales User',
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function saveHook(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<UserDocument>('User', userSchema);
export type UserHydratedDocument = HydratedDocument<UserDocument>;
