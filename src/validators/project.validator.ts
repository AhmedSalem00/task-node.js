import { z } from 'zod';

const projectStatusEnum = z.enum(['active', 'completed', 'archived']);

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
    description: z.string().trim().max(2000).optional(),
    status: projectStatusEnum.optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project id'),
  }),
  body: z
    .object({
      title: z.string().trim().min(2).max(150).optional(),
      description: z.string().trim().max(2000).optional(),
      status: projectStatusEnum.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    }),
});

export const projectIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid project id'),
  }),
});

export const listProjectsQuerySchema = z.object({
  query: z.object({
    status: projectStatusEnum.optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc', 'ASC', 'DESC']).optional(),
  }),
});
