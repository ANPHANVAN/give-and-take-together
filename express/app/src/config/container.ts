import { container } from 'tsyringe';
import { UserPrismaRepository } from '@/modules/users/repositories/prisma/user.prisma.repository';
import { UserService } from '@/modules/users/services/user.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserIdentityPrismaRepository } from '@/modules/users/repositories/prisma/userIdentity.repository';
import { OtpResetPrismaRepository } from '@/modules/auth/repositories/prisma/otpResetPrisma.repository';

// Singleton mặc định, hoặc dùng .registerType nếu transient
container.registerSingleton('IUserService', UserService);
container.registerSingleton('IAuthService', AuthService);
container.registerSingleton('PostsService', AuthService);
container.registerSingleton('IUserRepository', UserPrismaRepository);
container.registerSingleton('IUserIdentityRepository', UserIdentityPrismaRepository);
container.registerSingleton('IOtpResetRepository', OtpResetPrismaRepository);
container.registerSingleton('IPostsRepository', OtpResetPrismaRepository);

export { container };
