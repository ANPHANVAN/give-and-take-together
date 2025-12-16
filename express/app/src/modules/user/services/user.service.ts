import { IUserService } from './IUser.service';
import { IUserRepository } from '../repository/IUser.repository';
import { UserPrismaRepository } from '../repository/prisma/user.prisma.repository';
import { runTransaction } from '../../shared/database/transactionManager';

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepository) {}
  createUser(email: string) {
    return this.userRepo.createUser(email);
  }

  async transactionTest() {
    await runTransaction(async (uow) => {
      const userRepo = uow.getRepository(UserPrismaRepository);
      const userRepo2 = uow.getRepository(UserPrismaRepository);

      const newEmail = await userRepo.createUser('email');
      if (!newEmail) {
        throw new Error('error');
      }

      await userRepo2.findOneByEmail('mail');
    });
  }
}
