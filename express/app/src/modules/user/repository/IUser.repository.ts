import { Prisma, User } from '@/generated/client';

export interface IUserRepository {
  // CREATE
  createUser(email: string, fullname: string, passwordHash: string): Promise<User>;

  // READ
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;

  // UPDATE
  updateAll(id: string, data: Prisma.UserUpdateInput): Promise<User>;
  updateAvatarUrl(id: string, url: string): Promise<User>;
  updatePhone(id: string, phone: string): Promise<User>;
  updateSocialLinks(id: string, socialLinks: object): Promise<User>;
  updateTrustscore(id: string, trustScore: number): Promise<User>;
  updateGivenCount(id: string, givenCount: number): Promise<User>;
  updateReceivedCount(id: string, reveivedCount: number): Promise<User>;

  // DELETE
  deleteUserById(id: string): Promise<User>;
}
