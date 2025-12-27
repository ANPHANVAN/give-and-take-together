import { IUserRepository } from '../IUser.repository';
import { Prisma, User } from '@/generated/client';
import { BaseRepository } from '@/modules/shared/database/base.repository';

export class UserPrismaRepository extends BaseRepository implements IUserRepository {
  async createUser(email: string) {
    let user: Prisma.UserCreateInput;
    user = {
      fullname: 'string',
      email: email,
      passwordHash: 'hello',
    };
    return await this.db.user.create({ data: user });
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: { id: id },
    });
  }

  // async findOneByEmail(email: string) {
  //   return await this.db.user.findUnique({
  //     where: { email: email },
  //     omit: { passwordHash: true },
  //   });
  // }

  // async findManyByGivenCount(countMin: number) {
  //   return this.db.user.findMany({
  //     select: { email: true, fullname: true },
  //     where: { givenCount: countMin },
  //     orderBy: { fullname: 'asc' },
  //     take: 10,
  //     skip: 2,
  //   });
  // }
}
