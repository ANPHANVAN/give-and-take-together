import { UserSecurity } from '@/models/userSecurityModel';

export class UserSecurityRepository {
  findByUsername(username: string) {
    return UserSecurity.findOne({ username });
  }

  updatePassword(userId: string, hashPassword: string) {
    return UserSecurity.findByIdAndUpdate(userId, { hashPassword });
  }

  createSecurity(userId: string, username: string, hashPassword: string) {
    return UserSecurity.create({
      _id: userId,
      username,
      hashPassword,
    });
  }
}

export const userSecurityRepository = new UserSecurityRepository();
