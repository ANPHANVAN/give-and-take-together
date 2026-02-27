import express, { Router } from 'express';
import { UserController } from './user.controller';
import { container } from '@/config/container';

const userController = container.resolve(UserController);
const router: Router = express.Router();

// [get] /users
router.get('/', userController.getUsers);

// [post] /users
router.post('/', userController.createUser);

// [get] /users/:id
router.get('/:id', userController.getUser);

// [put] /users/:id
router.put('/:id', userController.putUser);

// [patch] /users/:id
router.patch('/:id', userController.patchUser);

// [delete] /users/:id
router.delete('/:id', userController.deleteUser);

export default router;
