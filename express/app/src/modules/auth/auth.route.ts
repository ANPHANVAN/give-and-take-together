import express, { Router } from 'express';
import { container } from '@/config/container';
import { AuthController } from './controllers/auth.controller';

const authController = container.resolve(AuthController);
const router: Router = express.Router();

// base /api/auth

// [post] /api/auth/login/form
router.post('/login/form', authController.loginByForm);

// [GET] /api/auth/refesh-token
router.get('/refesh-token', authController.refeshToken);

// [get] /api/auth/logout
router.get('/logout', authController.clearToken);

// // [GET] /api/auth/login/google
// router.get('/login/google', authController.redirectToGoogle);

// // [GET] /api/auth/login/google/callback
// router.get('/login/google/callback', authController.googleCallback);

// // [POST] /api/auth/login/authentication
// router.post('/login/authentication', authController.authentication);

// // [POST] /api/auth/register-new
// router.post('/register-new', authController.registerNew);

// // [POST] /api/auth/api/forgot-password
// router.post('/api/forgot-password', authController.forgotPassword);

// // [POST] /api/auth/api/reset-password/
// router.post('/api/reset-password', authController.resetPassword);

// // [PUT] /api/auth/change-password
// router.put('/change-password', authController.putPassword);

export default router;
