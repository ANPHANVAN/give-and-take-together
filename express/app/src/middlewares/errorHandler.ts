import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  detailBackendErrorMessage?: string;
}

export class AppError extends Error {
  status?: number;
  detailBackendErrorMessage?: string;

  constructor(message: string, status?: number, detail?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status || 500;
    this.detailBackendErrorMessage = detail || 'No Detail Message: ';
  }
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.detailBackendErrorMessage ? err.detailBackendErrorMessage + ': ' + err : err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
};
