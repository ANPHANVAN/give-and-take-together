import { Request, Response } from 'express';
import { UserPrismaRepository } from '../repository/prisma/user.prisma.repository';
import { UserService } from '../services/user.service';
import { Prisma } from '@/generated/client';

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    const userCreateData: Prisma.UserCreateInput = req.body;
    const newAccount = await this.userService.createUser(userCreateData);
    return res.status(200).json(newAccount);
  };

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getAllUser();
    console.log(users);

    return res.status(200).json(users);
  };
}

const userRepository = new UserPrismaRepository();
const userServiceSingleton = new UserService(userRepository);
const userController = new UserController(userServiceSingleton);

export default userController;
