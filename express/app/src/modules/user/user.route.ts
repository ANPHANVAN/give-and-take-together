import express, { Router } from 'express';
import userController from './controllers/user.controller';

const router: Router = express.Router();

// [GET] /auth/user
router.post('/user', userController.createUser);

export default router;
