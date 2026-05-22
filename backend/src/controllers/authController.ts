import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { signAccessToken } from '../utils/token.js';

const toAuthResponse = (user: { _id: string | { toString: () => string }; name: string; email: string; role: 'Admin' | 'Sales User' }) => ({
  user: {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token: signAccessToken({ userId: user._id.toString(), role: user.role }),
});

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: 'Admin' | 'Sales User';
  };

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User already exists');
  }

  const createdUser = await User.create({ name, email, password, role });
  res.status(201).json(toAuthResponse(createdUser.toObject()));
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const userObject = user.toObject();
  res.status(200).json(toAuthResponse(userObject));
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new ApiError(401, 'Not authorized');
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
