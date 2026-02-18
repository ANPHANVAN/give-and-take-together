import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import { AuthService } from '@/modules/auth/services/auth.service';
import { IUserRepository } from '@/modules/users/repositories/IUser.repository';
import { IUserIdentityRepository } from '@/modules/users/repositories/IUserIdentity.repository';
import { EErrorCodes } from '@/constants/errorCode.enum';
import { Role } from '@/generated/enums';

// ===== MOCK =====
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('@/modules/shared/security/password', () => ({
  verifyPassword: jest.fn(),
}));

describe('getAuthResultBySignToken', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService({} as IUserRepository, {} as IUserIdentityRepository);
  });

  it('should return accessToken & refreshToken correctly', () => {
    (jwt.sign as jest.Mock).mockReturnValueOnce('accessToken').mockReturnValueOnce('refreshToken');

    const payload = { id: '1', role: Role.USER };

    const result = service.getAuthResultBySignToken(payload);

    expect(jwt.sign).toHaveBeenNthCalledWith(1, payload, expect.any(String), { expiresIn: '1h' });

    expect(jwt.sign).toHaveBeenNthCalledWith(2, payload, expect.any(String), { expiresIn: '7d' });

    expect(result).toEqual({
      user: payload,
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });
  });
});

import { hashPassword } from '@/modules/shared/security/password';

jest.mock('@/modules/shared/security/password', () => ({
  hashPassword: jest.fn(),
}));

describe('AuthService - setPasswordFirstTime', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<IUserRepository>;
  let userIdentityRepo: jest.Mocked<IUserIdentityRepository>;

  beforeEach(() => {
    userRepo = {
      findUserById: jest.fn(),
      updateAllField: jest.fn(),
    } as any;

    userIdentityRepo = {} as any;

    service = new AuthService(userRepo, userIdentityRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws USER_NOT_FOUND if user does not exist', async () => {
    userRepo.findUserById.mockResolvedValue(null);

    await expect(
      service.setPasswordFirstTime({
        userId: '1',
        newPassword: '123456',
      }),
    ).rejects.toMatchObject({
      errorCode: EErrorCodes.USER_NOT_FOUND,
    });
  });

  it('throws AUTH_PASSWORD_ALREADY_SET if user already has password', async () => {
    userRepo.findUserById.mockResolvedValue({
      id: '1',
      passwordHash: 'hashed_password',
    } as any);

    await expect(
      service.setPasswordFirstTime({
        userId: '1',
        newPassword: '123456',
      }),
    ).rejects.toMatchObject({
      errorCode: EErrorCodes.AUTH_PASSWORD_ALREADY_SET,
      status: 400,
    });
  });

  it('sets password successfully if user has no password', async () => {
    userRepo.findUserById.mockResolvedValue({
      id: '1',
      passwordHash: null,
    } as any);

    (hashPassword as jest.Mock).mockResolvedValue('hashed_new_password');

    await service.setPasswordFirstTime({
      userId: '1',
      newPassword: '123456',
    });

    expect(hashPassword).toHaveBeenCalledWith('123456');

    expect(userRepo.updateAllField).toHaveBeenCalledWith('1', {
      passwordHash: 'hashed_new_password',
    });
  });
});
