import { NextFunction, Request, Response } from 'express';
import { IUserService } from '../services/IUser.service';
import { Prisma } from '@/generated/client';
import { injectable, inject } from 'tsyringe';
import { catchAsync } from '@/utils/catchAsync';
import { CreateUserDTO, TCreateUserDTO } from '../dto/createUser.dto';

@injectable()
export class UserController {
  constructor(@inject('IUserService') private userService: IUserService) {}

  createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const createUserParsed = CreateUserDTO.parse(req.body);
    const { passwordHash, ...userCreatedResponse } = await this.userService.createUser(createUserParsed);
    return res.status(201).json(userCreatedResponse);
  });

  getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userService.getAllUser();
    // console.log(users);
    return res.status(200).json(users);
  });

  // TODO fix this function
  getUser = catchAsync(async (req: Request, res: Response) => {
    return res.status(500).json({ message: 'TODO fix this function' });
  });

  // TODO fix this function
  putUser = catchAsync(async (req: Request, res: Response) => {
    return res.status(500).json({ message: 'TODO fix this function' });
  });

  // TODO fix this function
  patchUser = catchAsync(async (req: Request, res: Response) => {
    return res.status(500).json({ message: 'TODO fix this function' });
  });

  // TODO fix this function
  deleteUser = catchAsync(async (req: Request, res: Response) => {
    return res.status(500).json({ message: 'TODO fix this function' });
  });
}
