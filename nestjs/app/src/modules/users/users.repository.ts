import { Prisma, User } from '@/generated/client';
import { PrismaService } from '@/infras/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserCreateInput } from '@/generated/models';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx ? tx : this.prismaService.getClient();
  }

  createUser(userCreateInput: UserCreateInput, tx?: Prisma.TransactionClient) {
    return this.getClient(tx).user.create({
      data: {
        email: userCreateInput.email,
        fullname: userCreateInput.fullname,
        passwordHash: userCreateInput.passwordHash,
      },
    });
  }

  findAllUser(): Promise<User[]> {
    return this.getClient().user.findMany({});
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.getClient().user.findUnique({
      where: { id: id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.getClient().user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async updateAllField(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.getClient().user.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteUserById(id: string): Promise<User> {
    return this.getClient().user.delete({
      where: {
        id: id,
      },
    });
  }
}
