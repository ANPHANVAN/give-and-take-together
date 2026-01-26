import { Prisma, User } from '@/generated/client';

export interface IUserService {
  createUser(userCreateData: Prisma.UserCreateInput): Promise<unknown>;
  getAllUser(): Promise<User[]>;
}
