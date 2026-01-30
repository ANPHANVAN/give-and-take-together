import { EErrorCodes } from '@/constants/errorCode.enum';
import { AppCodeError, AppError } from '@/middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      if (err instanceof AppError) {
        next(err);
      } else if (err instanceof z.ZodError) {
        next(new AppCodeError(EErrorCodes.VALIDATION_ERROR));
      } else {
        next(new AppCodeError(EErrorCodes.INTERNAL_SERVER_ERROR));
      }
    });
  };
};
