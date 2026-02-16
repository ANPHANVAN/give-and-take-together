import { container } from 'tsyringe';
import { UserPrismaRepository } from '@/modules/user/repositories/prisma/user.prisma.repository';
import { UserService } from '@/modules/user/services/user.service';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserIdentityPrismaRepository } from '@/modules/user/repositories/prisma/userIdentity.repository';
import { OtpResetPrismaRepository } from '@/modules/auth/repositories/prisma/otpResetPrisma.repository';

// Singleton mặc định, hoặc dùng .registerType nếu transient
container.registerSingleton('IUserRepository', UserPrismaRepository);
container.registerSingleton('IUserService', UserService);
container.registerSingleton('IAuthService', AuthService);
container.registerSingleton('IUserIdentityRepository', UserIdentityPrismaRepository);
container.registerSingleton('IOtpResetRepository', OtpResetPrismaRepository);

// Export container để dùng ở nơi khác nếu cần
export { container };
