import { IUserRepository } from '../IUser.repository';
import { Prisma, User } from '@/generated/client';
import { AppError } from '@/middlewares/errorHandler';
import { BaseRepository } from '@/modules/shared/database/base.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export class UserPrismaRepository extends BaseRepository implements IUserRepository {
  async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return await this.db.user.create({ data: userData });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: { id: id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findAllUser(): Promise<User[]> {
    return this.db.user.findMany({});
  }

  async updateAllField(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteUserById(id: string): Promise<User> {
    return this.db.user.delete({
      where: {
        id: id,
      },
    });
  }
}
