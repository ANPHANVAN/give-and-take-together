import { UserIdentity } from '@/generated/client';
import { UserIdentityCreateInput } from '@/generated/models';
import { TLoginByOAuthDTO } from '@/modules/auth/dto/login.dto';

export interface IUserIdentityRepository {
  create(createUserIdentity: UserIdentityCreateInput): Promise<UserIdentity>;
  findUserByProviderUser(dto: TLoginByOAuthDTO): Promise<UserIdentity | null>;
}
