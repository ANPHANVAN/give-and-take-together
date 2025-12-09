import { UserService } from '../../../src/modules/user/services/user.service';
import { IUserRepository } from '../../../src/modules/user/repository/IUser.repository';

/**
 * Unit tests for UserService.createUser()
 */
describe('UserService.createUser', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Mock the repository
    mockUserRepository = {
      createUser: jest.fn(),
    };

    // Create service instance with mocked repository
    userService = new UserService(mockUserRepository);
  });

  describe('Success cases', () => {
    it('should create user successfully with valid email', async () => {
      // Arrange
      const email = 'test@example.com';
      const expectedUser = { id: '1', email, createdAt: new Date() };
      mockUserRepository.createUser.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(email);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(email);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
    });

    it('should create user with different email formats', async () => {
      // Test cases
      const testEmails = ['user+tag@example.co.uk', 'firstname.lastname@company.org', 'user123@subdomain.example.com'];

      for (const email of testEmails) {
        // Arrange
        const expectedUser = { id: 'some-id', email };
        mockUserRepository.createUser.mockResolvedValue(expectedUser);

        // Act
        const result = await userService.createUser(email);

        // Assert
        expect(result.email).toBe(email);
        expect(mockUserRepository.createUser).toHaveBeenCalledWith(email);
      }
    });
  });

  describe('Failure cases', () => {
    it('should throw error when repository fails', async () => {
      // Arrange
      const email = 'test@example.com';
      const error = new Error('Database connection failed');
      mockUserRepository.createUser.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.createUser(email)).rejects.toThrow('Database connection failed');
    });

    it('should handle timeout error from repository', async () => {
      // Arrange
      const email = 'test@example.com';
      const timeoutError = new Error('Request timeout');
      mockUserRepository.createUser.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(userService.createUser(email)).rejects.toThrow('Request timeout');
    });
  });
});
