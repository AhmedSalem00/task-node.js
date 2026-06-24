import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userService } from '../services/user.service';
import { getPagination, buildPaginatedResult } from '../utils/pagination';

const ALLOWED_SORT_FIELDS = ['createdAt', 'name', 'email', 'role'];

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req, ALLOWED_SORT_FIELDS);
  const { rows, count } = await userService.findAll(pagination);

  res.status(200).json({
    success: true,
    ...buildPaginatedResult(rows, count, pagination),
  });
});
