import { Task, TaskStatus, TaskPriority } from '../models/Task';
import { ApiError } from '../utils/ApiError';
import { PaginationParams } from '../utils/pagination';
import { JwtPayload } from '../utils/jwt';
import { findAccessibleProject } from './project.service';

interface CreateTaskParams {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

interface UpdateTaskParams {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
}

const findTaskInProjectOrThrow = async (projectId: string, taskId: string) => {
  const task = await Task.findOne({ where: { id: taskId, projectId } });
  if (!task) {
    throw ApiError.notFound('Task not found');
  }
  return task;
};

export const taskService = {
  async create(params: CreateTaskParams, requester: JwtPayload) {
    await findAccessibleProject(params.projectId, requester);

    return Task.create({
      title: params.title,
      description: params.description ?? null,
      status: params.status,
      priority: params.priority,
      dueDate: params.dueDate ? new Date(params.dueDate) : null,
      projectId: params.projectId,
    });
  },

  async findAllForProject(
    projectId: string,
    requester: JwtPayload,
    pagination: PaginationParams,
    filters: TaskFilters
  ) {
    await findAccessibleProject(projectId, requester);

    const where: Record<string, unknown> = { projectId };
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;

    const { rows, count } = await Task.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: pagination.offset,
      order: [[pagination.sortBy, pagination.sortOrder]],
    });

    return { rows, count };
  },

  async findById(projectId: string, taskId: string, requester: JwtPayload) {
    await findAccessibleProject(projectId, requester);
    return findTaskInProjectOrThrow(projectId, taskId);
  },

  async update(projectId: string, taskId: string, requester: JwtPayload, updates: UpdateTaskParams) {
    await findAccessibleProject(projectId, requester);
    const task = await findTaskInProjectOrThrow(projectId, taskId);

    const { dueDate, ...rest } = updates;
    await task.update({
      ...rest,
      ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
    });

    return task;
  },

  async delete(projectId: string, taskId: string, requester: JwtPayload) {
    await findAccessibleProject(projectId, requester);
    const task = await findTaskInProjectOrThrow(projectId, taskId);
    await task.destroy();
  },
};
