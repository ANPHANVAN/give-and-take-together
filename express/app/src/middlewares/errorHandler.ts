import { Request, Response, NextFunction } from 'express';
import { EErrorCodes } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessage';

export interface AppError extends Error {
  status: number;
  errorCode: string;
  details: any[];
}
export class AppError extends Error {
  status: number;
  errorCode: string;
  details: any[];

  constructor(message?: string, status?: number, errorCode?: string, details?: any[]) {
    super(message || ERROR_MESSAGES[EErrorCodes.INTERNAL_SERVER_ERROR]?.message);
    this.name = 'AppError';
    this.errorCode = errorCode || EErrorCodes.INTERNAL_SERVER_ERROR;
    this.status = status || 500;
    this.details = details || [];
  }
}

export const errorHandler = (err: AppError, req: Request, res: Response) => {
  console.error(err);

  return res.status(err.status).json({
    message: err.message,
    status: err.status,
    errorCode: err.errorCode,
  });
};
