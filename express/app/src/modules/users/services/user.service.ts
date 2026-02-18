import { inject, injectable } from 'tsyringe';
import { Prisma, User } from '@/generated/client';
import { AppCodeError } from '@/middlewares/errorHandler';
import { EErrorCodes } from '@/constants/errorCode.enum';
import { hashPassword } from '@/modules/shared/security/password';
import { IUserService } from './IUser.service';
import { IUserRepository } from '../repositories/IUser.repository';
import { runTransaction } from '../../shared/database/transactionManager';
import { TCreateUserDTO } from '../dto/createUser.dto';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('IUserRepository')
    private userRepo: IUserRepository,
  ) {}

  async createUser(createUserDTO: TCreateUserDTO): Promise<User> {
    const user = await this.userRepo.findUserByEmail(createUserDTO.email);
    if (user) throw new AppCodeError(EErrorCodes.AUTH_EMAIL_EXIST);

    const passwordHashed = await hashPassword(createUserDTO.password);
    const userCreateData: Prisma.UserCreateInput = {
      email: createUserDTO.email,
      fullname: createUserDTO.fullname,
      passwordHash: passwordHashed,
    };
    return await this.userRepo.createUser(userCreateData);
  }

  async getAllUser(): Promise<User[]> {
    const users = await this.userRepo.findAllUser();
    return users;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.userRepo.findUserById(userId);
  }

  async putUser(userId: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) return null;
    return this.userRepo.updateAllField(userId, data);
  }

  async patchUser(userId: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) return null;
    return this.userRepo.updateAllField(userId, data);
  }

  async deleteUser(userId: string): Promise<User | null> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) return null;
    return this.userRepo.deleteUserById(userId);
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
