import { EErrorCodes } from '@/constants/errorCode.enum';
import { NextFunction, Request, Response } from 'express';
import { AppCodeError } from './errorHandler';

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) throw new AppCodeError(EErrorCodes.AUTH_UNAUTHORIZED);

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('accessToken');
    throw new AppCodeError(EErrorCodes.AUTH_UNAUTHORIZED);
  }
};
