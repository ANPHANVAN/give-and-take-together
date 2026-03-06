import { Prisma, UserIdentity } from '@/generated/client';
import { UserIdentityCreateInput } from '@/generated/models';
import { PrismaService } from '@/infras/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserIdentityRepository {
  constructor(private prismaService: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx ? tx : this.prismaService.getClient();
  }

  create(createUserIdentity: UserIdentityCreateInput): Promise<UserIdentity> {
    return this.getClient().userIdentity.create({
      data: createUserIdentity,
    });
  }

  async findUserByProviderUser(dataCreate: {
    provider: 'GOOGLE' | 'GITHUB' | 'FACEBOOK';
    providerUserId: string;
    name: string;
    email?: string | undefined;
  }): Promise<UserIdentity | null> {
    return this.getClient().userIdentity.findFirst({
      where: {
        provider: dataCreate.provider,
        providerUserId: dataCreate.providerUserId,
      },
    });
  }
}
