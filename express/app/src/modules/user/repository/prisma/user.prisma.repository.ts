// interface UserPrismaRepository {
//   createUser (): any;
// }
import { prisma } from '@/providers/datatbase.provider';

export class UserPrismaRepository {
  createUser(email2: string) {
    return prisma.user.create({ data: { email: email2 } });
  }
}
