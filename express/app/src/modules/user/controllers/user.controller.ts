import { Request, Response } from 'express';
import { UserPrismaRepository } from '../repository/prisma/user.prisma.repository';
import { UserService } from '../services/user.service';

export class UserController {
  constructor(private userService: UserService) {}
  async createUser(req: Request, res: Response) {
    const newAccount = await this.userService.createUser('fff@gmail.com');
    return res.status(200).json(newAccount);
  }
}

const userRepository = new UserPrismaRepository();
const userServiceSingleton = new UserService(userRepository);
export const userController = new UserController(userServiceSingleton);
