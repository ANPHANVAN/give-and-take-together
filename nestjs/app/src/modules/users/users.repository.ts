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

  findAllUser(): Promise<User[]> {
    return this.getClient().user.findMany({});
  }

  createUser(userCreateInput: UserCreateInput) {
    return this.getClient().user.create({
      data: {
        email: userCreateInput.email,
        fullname: userCreateInput.fullname,
        passwordHash: userCreateInput.passwordHash,
      },
    });
  }
}
