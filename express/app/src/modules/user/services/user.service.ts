import { IUserService } from './IUser.service';
import { IUserRepository } from '../repositories/IUser.repository';
import { runTransaction } from '../../shared/database/transactionManager';
import { Prisma, User } from '@/generated/client';
import { AppCodeError } from '@/middlewares/errorHandler';
import { inject, injectable } from 'tsyringe';
import { EErrorCodes } from '@/constants/errorCode';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository')
    private userRepo: IUserRepository,
  ) {}

  async createUser(userCreateData: Prisma.UserCreateInput) {
    const user = await this.userRepo.findUserByEmail(userCreateData.email);
    if (user) throw new AppCodeError(EErrorCodes.AUTH_EMAIL_EXIST);
    return await this.userRepo.createUser(userCreateData);
  }

  async getAllUser(): Promise<User[]> {
    const users = await this.userRepo.findAllUser();
    return users;
  }

  // async transactionTest() {
  //   await runTransaction(async (uow) => {
  //     const userRepo = uow.getRepository(UserPrismaRepository);
  //     const userRepo2 = uow.getRepository(UserPrismaRepository);

  //     const newEmail = await userRepo.createUser('email');
  //     if (!newEmail) {
  //       throw new Error('error');
  //     }

  //     await userRepo2.findOneByEmail('mail');
  //   });
  // }
}
