import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services/IUser.service';
import { Prisma } from '@/generated/client';
import { injectable, inject } from 'tsyringe';
import { catchAsync } from '@/utils/catchAsync';

@injectable()
export class UserController {
  constructor(@inject('IUserService') private userService: IUserService) {}

  createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userCreateData: Prisma.UserCreateInput = req.body;
    const newAccount = await this.userService.createUser(userCreateData);
    return res.status(200).json(newAccount);
  });

  getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userService.getAllUser();
    // console.log(users);
    return res.status(200).json(users);
  });
}
