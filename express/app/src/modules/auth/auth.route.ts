import express, { Router } from 'express';
import { container } from '@/config/container';
import { AuthController } from './controllers/auth.controller';
import passport from 'passport';
import { authMiddleware } from '@/middlewares/auth.middleware';

const authController = container.resolve(AuthController);
const router: Router = express.Router();

// base /api/auth

// [post] /api/auth/form
router.post('/form', authController.loginByForm);

// [post] /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// [delete] /api/auth/logout
router.delete('/logout', authController.clearToken);

// [get] /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// [get] /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authController.loginWithOAuth,
);

// [get] /api/auth/facebook
router.get('/facebook', passport.authenticate('facebook', { scope: [/* 'email', */ 'public_profile'] }));

// [get] /api/auth/facebook/callback
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', failureMessage: true, session: false }),
  authController.loginWithOAuth,
);

// // [post] /api/auth/register
// router.post('/register', authController.registerUser);

// // [post] /api/auth/forgot-password
// router.post('/forgot-password', authController.forgotPassword);

// // [post] /api/auth/reset-password
// router.post('/reset-password', authController.resetPassword);

// [put] /api/auth/change-password
router.put('/change-password', authMiddleware, authController.putPassword);

// [post] /api/auth/set-password
router.post('/set-password', authMiddleware, authController.setPassword);

export default router;
