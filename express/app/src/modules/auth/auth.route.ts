import express, { Router } from 'express';
import authController from './controllers/auth.controller';

const router: Router = express.Router();
// [GET] /auth/logout
router.get('/logout', authController.logout);

// [GET] /auth/login/google
router.get('/login/google', authController.redirectToGoogle);

// [GET] /auth/login/google/callback
router.get('/login/google/callback', authController.googleCallback);

// [POST] /auth/login/authentication
router.post('/login/authentication', authController.authentication);

// [POST] /auth/register-new
router.post('/register-new', authController.registerNew);

// [POST] /auth/api/forgot-password
router.post('/api/forgot-password', authController.forgotPassword);

// [POST] /auth/api/reset-password/
router.post('/api/reset-password', authController.resetPassword);

// [PUT] /auth/change-password
router.put('/change-password', authController.putPassword);

export default router;
