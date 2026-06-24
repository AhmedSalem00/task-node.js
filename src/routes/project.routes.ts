import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
  listProjectsQuerySchema,
} from '../validators/project.validator';
import taskRoutes from './task.routes';

const router = Router();

router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/', validate(listProjectsQuerySchema), projectController.getProjects);
router.get('/:id', validate(projectIdParamSchema), projectController.getProjectById);
router.put('/:id', validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', validate(projectIdParamSchema), projectController.deleteProject);

// Nested task routes: /api/projects/:projectId/tasks
router.use('/:projectId/tasks', taskRoutes);

export default router;
