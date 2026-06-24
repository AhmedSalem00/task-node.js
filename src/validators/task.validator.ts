import { z } from 'zod';

const taskStatusEnum = z.enum(['pending', 'in_progress', 'done']);
const taskPriorityEnum = z.enum(['low', 'medium', 'high']);

export const createTaskSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project id'),
  }),
  body: z.object({
    title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
    description: z.string().trim().max(2000).optional(),
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    dueDate: z.string().datetime().or(z.string().date()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project id'),
    taskId: z.string().uuid('Invalid task id'),
  }),
  body: z
    .object({
      title: z.string().trim().min(2).max(150).optional(),
      description: z.string().trim().max(2000).optional(),
      status: taskStatusEnum.optional(),
      priority: taskPriorityEnum.optional(),
      dueDate: z.string().datetime().or(z.string().date()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const taskParamsSchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project id'),
    taskId: z.string().uuid('Invalid task id'),
  }),
});

export const listTasksQuerySchema = z.object({
  params: z.object({
    projectId: z.string().uuid('Invalid project id'),
  }),
  query: z.object({
    status: taskStatusEnum.optional(),
    priority: taskPriorityEnum.optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
  }),
});
