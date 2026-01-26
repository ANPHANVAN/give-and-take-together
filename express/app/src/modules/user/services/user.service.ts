import { IUserService } from './IUser.service';
import { IUserRepository } from '../repositories/IUser.repository';
import { UserPrismaRepository } from '../repositories/prisma/user.prisma.repository';
import { runTransaction } from '../../shared/database/transactionManager';
import { Prisma, User } from '@/generated/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AppError } from '@/middlewares/errorHandler';

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepository) {}

  async createUser(userCreateData: Prisma.UserCreateInput) {
    try {
      return await this.userRepo.createUser(userCreateData);
    } catch (error) {
      console.error(error);

      // console.error(
      //   '====================================\n' +
      //     JSON.stringify(error, null, 2) +
      //     '\n=====================================',
      // );
      if (error instanceof PrismaClientKnownRequestError) {
        // P2002: unique constraint failed
        if (error.code === 'P2002') {
          // error.meta.target: mảng các trường bị trùng, ví dụ: ['email']
          const targetFields = error.meta?.driverAdapterError?.cause?.constraint?.fields as string[] | undefined;

          if (targetFields?.includes('email')) {
            throw new AppError('Email đã tồn tại. Vui lòng dùng email khác.', 400);
          }

          // Nếu có nhiều trường unique khác (ví dụ: phone, username), xử lý tương tự
          throw new AppError('Dữ liệu trùng lặp: ' + (targetFields?.join(', ') || 'không xác định'), 400);
        }

        // Các lỗi Prisma khác (ví dụ: P2003 foreign key, P2025 not found, v.v.)
        throw error;
      }
      throw error;
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
