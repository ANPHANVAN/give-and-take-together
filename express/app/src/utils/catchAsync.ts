import { EErrorCodes } from '@/constants/errorCode';
import { AppCodeError, AppError } from '@/middlewares/errorHandler';
import { Request, Response, NextFunction } from 'express';

export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: any) => {
      if (err instanceof AppError) {
        next(err);
      } else {
        next(new AppCodeError(EErrorCodes.INTERNAL_SERVER_ERROR));
      }
    });
  };
};
