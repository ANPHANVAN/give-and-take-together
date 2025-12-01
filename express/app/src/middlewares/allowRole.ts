import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Middleware check role user
 * @param {string[]} allowedRoles - List of allowed roles
 */
export const allowRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'User not authenticated!' });
    }

    if (!allowedRoles.includes(userRole)) {
      const error: AppError = {
        name: 'ForbiddenError',
        message: `Permission denied. Allowed roles: ${allowedRoles.join(', ')}`,
        status: 403,
      };
      return next(error);
    }

    next();
  };
};
