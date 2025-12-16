import { IUserRepository } from '../IUser.repository';
import { Prisma } from '@/generated/client';
import { TransactionClient } from '@/generated/internal/prismaNamespace';
import { BaseRepository } from '@/modules/shared/database/base.repository';

export class UserPrismaRepository extends BaseRepository implements IUserRepository {
  createNewRepo(txCallback: TransactionClient) {
    return new UserPrismaRepository(txCallback);
  }

  async createUser(email: string) {
    let user: Prisma.UserCreateInput;
    user = {
      username: 'string',
      email: email,
      passwordHash: 'helo',
    };
    return await this.db.user.create({ data: user });
  }

  async findOneByEmail(email: string) {
    return await this.db.user.findUnique({
      where: { email: email },
      omit: { passwordHash: true },
    });
  }

  async findManyByGivenCount(countMin: number) {
    return this.db.user.findMany({
      select: { email: true, username: true },
      where: { givenCount: countMin },
      orderBy: { username: 'asc' },
      take: 10,
      skip: 2,
    });
  }
}
