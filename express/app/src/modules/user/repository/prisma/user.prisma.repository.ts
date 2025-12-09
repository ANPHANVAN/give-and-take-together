import { IUserRepository } from '../IUser.repository';
import { prisma } from '@/providers/datatbase.provider';

export class UserPrismaRepository implements IUserRepository {
  createUser(email2: string) {
    return prisma.user.create({ data: { email: email2 } });
  }
}
