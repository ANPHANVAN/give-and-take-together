import { Prisma, User } from '@/generated/client';
import { TCreateUserDTO } from '../dto/createUser.dto';

export interface IUserService {
  createUser(userCreateData: TCreateUserDTO): Promise<User>;
  getAllUser(): Promise<User[]>;
  getUser(userId: string): Promise<User | null>;
  putUser(userId: string, data: Prisma.UserUpdateInput): Promise<User | null>;
  patchUser(userId: string, data: Prisma.UserUpdateInput): Promise<User | null>;
  deleteUser(userId: string): Promise<User | null>;
}
