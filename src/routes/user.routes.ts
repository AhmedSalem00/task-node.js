import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validate.middleware';
import { listUsersQuerySchema } from '../validators/user.validator';

const router = Router();

router.get('/', authorize('admin'), validate(listUsersQuerySchema), userController.getUsers);

export default router;
