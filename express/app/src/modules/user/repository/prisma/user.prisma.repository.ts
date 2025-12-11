import { IUserRepository } from '../IUser.repository';
import { Prisma } from '@/generated/client';
import { BaseRepository } from '@/modules/shared/repository/base.repository';
import { prisma } from '@/providers/datatbase.provider';

export class UserPrismaRepository extends BaseRepository implements IUserRepository {
  private getClient(tx?: any) {
    return tx || prisma;
  }

  async createUser(email: string, tx?: any) {
    let user: Prisma.UserCreateInput;
    user = {
      username: 'string',
      email: email,
      passwordHash: 'helo',
    };
    return await this.getClient(tx).user.create({ data: user });
  }

  async findOneByEmail(email: string, tx?: any) {
    return await this.getClient(tx).user.findUnique({
      where: { email: email },
      omit: { passwordHash: true },
    });
  }

  async findManyByGivenCount(countMin: number, tx?: any) {
    return this.getClient(tx).user.findMany({
      select: { email: true, username: true },
      where: { givenCount: countMin },
      orderBy: { username: 'asc' },
      take: 10,
      skip: 2,
    });
  }
}
