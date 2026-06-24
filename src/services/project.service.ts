import { Project, ProjectStatus } from '../models/Project';
import { ApiError } from '../utils/ApiError';
import { PaginationParams } from '../utils/pagination';
import { JwtPayload } from '../utils/jwt';

interface CreateProjectParams {
  title: string;
  description?: string;
  status?: ProjectStatus;
  ownerId: string;
}

interface UpdateProjectParams {
  title?: string;
  description?: string;
  status?: ProjectStatus;
}

interface ProjectFilters {
  status?: ProjectStatus;
}

/**
 * Fetches a project and verifies the requester is allowed to access it.
 * Admins may access any project; members may only access their own.
 * Exported so task.service can reuse it without duplicating the logic.
 */
export const findAccessibleProject = async (projectId: string, requester: JwtPayload) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  if (requester.role !== 'admin' && project.ownerId !== requester.id) {
    throw ApiError.forbidden('You do not have access to this project');
  }

  return project;
};

export const projectService = {
  async create(params: CreateProjectParams) {
    return Project.create({
      title: params.title,
      description: params.description ?? null,
      status: params.status,
      ownerId: params.ownerId,
    });
  },

  async findAllForUser(requester: JwtPayload, pagination: PaginationParams, filters: ProjectFilters = {}) {
    const where: Record<string, unknown> = requester.role === 'admin' ? {} : { ownerId: requester.id };
    if (filters.status) where.status = filters.status;

    const { rows, count } = await Project.findAndCountAll({
      where,
      limit: pagination.limit,
      offset: pagination.offset,
      order: [[pagination.sortBy, pagination.sortOrder]],
    });

    return { rows, count };
  },

  async findById(projectId: string, requester: JwtPayload) {
    return findAccessibleProject(projectId, requester);
  },

  async update(projectId: string, requester: JwtPayload, updates: UpdateProjectParams) {
    const project = await findAccessibleProject(projectId, requester);
    await project.update(updates);
    return project;
  },

  async delete(projectId: string, requester: JwtPayload) {
    const project = await findAccessibleProject(projectId, requester);
    await project.destroy(); // tasks cascade via ON DELETE CASCADE in migration
  },
};
