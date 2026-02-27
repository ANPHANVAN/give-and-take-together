import 'reflect-metadata';
import { UserService } from '@/modules/users/user.service';
import { IUserRepository } from '@/modules/users/repositories/IUser.repository';
import { hashPassword } from '@/modules/shared/security/password';
import { any } from 'zod';
/**
 * Unit tests for UserService.createUser()
 */

jest.mock('@/modules/shared/security/password', () => ({
  hashPassword: jest.fn(),
}));

describe('UserService.createUser', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Mock the repository
    mockUserRepository = {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
    } as any;

    (hashPassword as jest.Mock).mockResolvedValue('hashed_password');
    // Create service instance with mocked repository
    userService = new UserService(mockUserRepository);
  });

  describe('Success cases', () => {
    it('should create user successfully with valid email', async () => {
      // Arrange

      const userCreate = {
        email: 'test@example.com',
        fullname: 'Phan Van An',
        password: 'phanvanan',
      };
      const expectedUser = {
        id: '1',
        email: userCreate,
        hashPassword: 'hashed_password',
        createdAt: new Date(),
      } as any;
      mockUserRepository.createUser.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userCreate);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(result).toMatchObject({
        hashPassword: 'hashed_password',
      });
      expect(result).not.toMatchObject({ password: any });
    });
  });
});
