import { BaseRepository } from '@/modules/shared/database/base.repository';
import { IUserIdentityRepository } from '../IUserIdentity.repository';
import { UserIdentity } from '@/generated/client';
import { UserIdentityCreateInput } from '@/generated/models';
import { TLoginByOAuthDTO } from '@/modules/auth/dto/login.dto';

export class UserIdentityPrismaRepository extends BaseRepository implements IUserIdentityRepository {
  create(createUserIdentity: UserIdentityCreateInput): Promise<UserIdentity> {
    return this.db.userIdentity.create({
      data: createUserIdentity,
    });
  }

  async findUserByProviderUser(dto: TLoginByOAuthDTO): Promise<UserIdentity | null> {
    return this.db.userIdentity.findFirst({
      where: {
        provider: dto.provider,
        providerUserId: dto.providerUserId,
      },
    });
  }
}
