import { container } from 'tsyringe';
import { UserPrismaRepository } from '@/modules/user/repositories/prisma/user.prisma.repository';
import { UserService } from '@/modules/user/services/user.service';
import { AuthService } from '@/modules/auth/services/auth.service';

// Singleton mặc định, hoặc dùng .registerType nếu transient
container.registerSingleton('IUserRepository', UserPrismaRepository);
container.registerSingleton('IUserService', UserService);
container.registerSingleton('IAuthService', AuthService);

// Export container để dùng ở nơi khác nếu cần
export { container };
