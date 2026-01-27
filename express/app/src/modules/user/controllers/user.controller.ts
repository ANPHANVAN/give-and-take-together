import { Request, Response } from 'express';
import { IUserService } from '../services/IUser.service';
import { Prisma } from '@/generated/client';
import { AppError } from '@/middlewares/errorHandler';
import { injectable, inject } from 'tsyringe';

@injectable()
export class UserController {
  constructor(@inject('IUserService') private userService: IUserService) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const userCreateData: Prisma.UserCreateInput = req.body;
      const newAccount = await this.userService.createUser(userCreateData);
      return res.status(200).json(newAccount);
    } catch (error: any) {
      throw new AppError('Failed to create user', 500, error?.message || String(error));
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUser();
      // console.log(users);
      return res.status(200).json(users);
    } catch (error: any) {
      throw new AppError('Failed to fetch all users', 500, error?.message || String(error));
    }
  };
}
