import { container } from 'tsyringe';
import { UserPrismaRepository } from '@/modules/user/repositories/prisma/user.prisma.repository';
import { UserService } from '@/modules/user/services/user.service';

// Singleton mặc định, hoặc dùng .registerType nếu transient
container.registerSingleton('IUserRepository', UserPrismaRepository);
container.registerSingleton('IUserService', UserService);

// Export container để dùng ở nơi khác nếu cần
export { container };
