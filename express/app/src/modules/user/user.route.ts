import express, { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { container } from '@/config/container';

const userController = container.resolve(UserController);
const router: Router = express.Router();

// [GET] /user/users
router.get('/users', userController.getUsers);

// [POST] /user
router.post('/', userController.createUser);

export default router;
