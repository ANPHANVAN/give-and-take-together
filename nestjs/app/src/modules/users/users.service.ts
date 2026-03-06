import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '@/generated/client';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '@/common/utils/password';

@Injectable()
export class UsersService {
  constructor(private userRepo: UsersRepository) {}

  findAllUserByAdmin(): Promise<User[]> {
    return this.userRepo.findAllUser();
  }

  async createUser(createUserDTO: CreateUserDto): Promise<User> {
    const user = await this.userRepo.findUserByEmail(createUserDTO.email);
    if (user) throw new HttpException({ message: 'Email này đã được đăng ký' }, HttpStatus.CONFLICT);

    const passwordHashed = await hashPassword(createUserDTO.password);
    const userCreateData = {
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

  // TODO: need change any to clear type
  async putUser(userId: string, data: any): Promise<User | null> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) return null;
    return this.userRepo.updateAllField(userId, data);
  }

  async deleteUser(userId: string): Promise<User | null> {
    const user = await this.userRepo.findUserById(userId);
    if (!user) return null;
    return this.userRepo.deleteUserById(userId);
  }
}
