import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { projectService } from '../services/project.service';
import { getPagination, buildPaginatedResult } from '../utils/pagination';
import { ApiError } from '../utils/ApiError';
import { ProjectStatus } from '../models/Project';

const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'title', 'status'];

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  const project = await projectService.create({
    title,
    description,
    status,
    ownerId: req.user!.id,
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project,
  });
});

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const pagination = getPagination(req, ALLOWED_SORT_FIELDS);
  const filters = { status: req.query.status as ProjectStatus | undefined };
  const { rows, count } = await projectService.findAllForUser(req.user!, pagination, filters);

  res.status(200).json({
    success: true,
    ...buildPaginatedResult(rows, count, pagination),
  });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.findById(req.params.id, req.user!);

  res.status(200).json({
    success: true,
    data: project,
  });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.update(req.params.id, req.user!, req.body);

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: project,
  });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await projectService.delete(req.params.id, req.user!);

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully',
  });
});
