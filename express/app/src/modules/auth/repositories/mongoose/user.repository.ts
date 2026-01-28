import { UserModel } from '@/models/userModel';

export class UserRepository {
  findById(id: string) {
    return UserModel.findById(id);
  }

  findByUsernameOrEmail(username: string, email: string) {
    return UserModel.findOne({
      $or: [{ username }, { email }],
    });
  }

  findByGoogleOAuth(sub: string) {
    return UserModel.findOne({ oauthId: sub, provider: 'google' });
  }

  createGoogleUser(data: any) {
    return UserModel.create(data);
  }

  createUser(data: any) {
    return UserModel.create(data);
  }
}
