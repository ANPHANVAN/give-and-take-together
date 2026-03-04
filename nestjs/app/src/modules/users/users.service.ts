import { Injectable } from '@nestjs/common';
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

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await hashPassword(dto.password);
    return this.userRepo.createUser({
      fullname: dto.name,
      email: dto.email,
      passwordHash: hashedPassword,
    });
  }
}
