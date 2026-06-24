import { User } from '../models/User';
import { PaginationParams } from '../utils/pagination';

export const userService = {
  /** Admin-only: list all users in the system (passwords excluded). */
  async findAll(pagination: PaginationParams) {
    const { rows, count } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit: pagination.limit,
      offset: pagination.offset,
      order: [[pagination.sortBy, pagination.sortOrder]],
    });

    return { rows, count };
  },
};
