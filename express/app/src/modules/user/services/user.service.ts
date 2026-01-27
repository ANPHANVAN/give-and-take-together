import { IUserService } from './IUser.service';
import { IUserRepository } from '../repositories/IUser.repository';
import { runTransaction } from '../../shared/database/transactionManager';
import { Prisma, User } from '@/generated/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AppError } from '@/middlewares/errorHandler';
import { inject, injectable } from 'tsyringe';
import { ERROR_MESSAGES } from '@/constants/errorMessage';
import { EErrorCodes } from '@/constants/errorCode';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository')
    private userRepo: IUserRepository,
  ) {}

  async createUser(userCreateData: Prisma.UserCreateInput) {
    try {
      const user = await this.userRepo.findUserByEmail(userCreateData.email);
      if (user) throw new AppError('This Email Exited', 400);
      return await this.userRepo.createUser(userCreateData);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // P2002: unique constraint failed
        if (error.code === 'P2002') {
          const targetFields = (error.meta?.driverAdapterError as any)?.cause?.constraint?.fields as
            | string[]
            | undefined;
          if (targetFields?.includes('email')) {
            throw new AppError(
              ERROR_MESSAGES[EErrorCodes.AUTH_EMAIL_EXIST]?.message,
              ERROR_MESSAGES[EErrorCodes.AUTH_EMAIL_EXIST]?.status,
            );
          }
          throw new AppError('Dữ liệu trùng lặp: ' + (targetFields?.join(', ') || 'không xác định'), 400);
        }
        throw error;
      }
      throw new AppError();
    }
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
