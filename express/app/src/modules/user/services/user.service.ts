import { UserPrismaRepository } from '../repository/prisma/user.prisma.repository';

export class UserService {
  constructor(private userRepo: UserPrismaRepository) {}
  createUser(email: string) {
    this.userRepo.createUser(email);
  }
}
