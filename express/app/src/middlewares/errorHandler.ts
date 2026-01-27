import { Request, Response, NextFunction } from 'express';
import { EErrorCodes, ErrorCodeType } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessage';

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

export class AppCodeError extends AppError {
  constructor(errorCode: ErrorCodeType = EErrorCodes.INTERNAL_SERVER_ERROR) {
    super(ERROR_MESSAGES[errorCode]?.message, ERROR_MESSAGES[errorCode]?.status, errorCode, []);
    this.name = 'AppCodeError';
  }
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  return res.status(err.status).json({
    message: err.message,
    status: err.status,
    errorCode: err.errorCode,
  });
};
