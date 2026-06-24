import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../utils/asyncHandler';
import { authService } from '../services/auth.service';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user!.id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user!.id);
  if (!user) throw ApiError.notFound('User not found');

  const { name, currentPassword, password } = req.body as {
    name?: string;
    currentPassword?: string;
    password?: string;
  };

  if (password && currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');
    user.password = await bcrypt.hash(password, 12);
  }

  if (name) user.name = name;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user.toSafeJSON(),
  });
});
