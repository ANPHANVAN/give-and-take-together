import { IUserService } from './IUser.service';
import { IUserRepository } from '../repository/IUser.repository';
import { prisma } from '@/providers/datatbase.provider';

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepository) {}
  createUser(email: string) {
    return this.userRepo.createUser(email);
  }

  async transactionTest() {
    await prisma.$transaction(async (txCallback) => {
      const allUsers = await txCallback.user.findMany({});

      if (allUsers.length !== 100) {
        throw new Error('You not is 100th user');
      }

      await txCallback.user.delete({ where: { email: 'abogab@gmailc.om' } });
    });
  }

  async transactionNew() {
    await this.userRepo.transaction(async (txCallback) => {
      const allUsers = await this.userRepo.createUser('dfsdfsdf', txCallback);

      if (allUsers.length !== 100) {
        throw new Error('You not is 100th user');
      }

      await txCallback.user.delete({ where: { email: 'abogab@gmailc.om' } });
    });
  }
}
