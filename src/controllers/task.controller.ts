import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { taskService } from '../services/task.service';
import { getPagination, buildPaginatedResult } from '../utils/pagination';
import { TaskStatus, TaskPriority } from '../models/Task';

const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'title', 'status', 'priority', 'dueDate'];

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { title, description, status, priority, dueDate } = req.body;

  const task = await taskService.create(
    { projectId, title, description, status, priority, dueDate },
    req.user!
  );

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const pagination = getPagination(req, ALLOWED_SORT_FIELDS);

  const filters = {
    status: req.query.status as TaskStatus | undefined,
    priority: req.query.priority as TaskPriority | undefined,
  };

  const { rows, count } = await taskService.findAllForProject(projectId, req.user!, pagination, filters);

  res.status(200).json({
    success: true,
    ...buildPaginatedResult(rows, count, pagination),
  });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;
  const task = await taskService.findById(projectId, taskId, req.user!);

  res.status(200).json({
    success: true,
    data: task,
  });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;
  const task = await taskService.update(projectId, taskId, req.user!, req.body);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;
  await taskService.delete(projectId, taskId, req.user!);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
});
