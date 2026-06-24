import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createTaskSchema,
  updateTaskSchema,
  taskParamsSchema,
  listTasksQuerySchema,
} from '../validators/task.validator';

// mergeParams allows access to :projectId from the parent router
const router = Router({ mergeParams: true });

router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/', validate(listTasksQuerySchema), taskController.getTasks);
router.get('/:taskId', validate(taskParamsSchema), taskController.getTaskById);
router.put('/:taskId', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:taskId', validate(taskParamsSchema), taskController.deleteTask);

export default router;
