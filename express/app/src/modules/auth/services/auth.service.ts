import { inject, injectable } from 'tsyringe';
import { TLoginByFormDTO, TLoginByOAuthDTO } from '../dto/login.dto';
import { IAuthResult, IAuthService } from './IAuth.service';
import { IUserRepository } from '@/modules/user/repositories/IUser.repository';
import { AppCodeError, AppError } from '@/middlewares/errorHandler';
import { EErrorCodes } from '@/constants/errorCode.enum';
import { verifyPassword } from '@/modules/shared/security/password';
import jwt from 'jsonwebtoken';
import envConfig from '@/config/envConfig';
import { generateRandomString } from '@/utils/auth';
import { Role } from '@/generated/enums';
import { IUserIdentityRepository } from '@/modules/user/repositories/IUserIdentity.repository';
import { runTransaction } from '@/modules/shared/database/transactionManager';
import { UserPrismaRepository } from '@/modules/user/repositories/prisma/user.prisma.repository';
import { UserIdentityPrismaRepository } from '@/modules/user/repositories/prisma/userIdentity.repository';

const JWT_SECRET = envConfig.jwt.JWT_SECRET;

interface IPayloadJWT {
  id: string;
  role: Role;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('IUserRepository') private userRepo: IUserRepository,
    @inject('IUserIdentityRepository') private userIdentityRepo: IUserIdentityRepository,
  ) {}

  getAuthResultBySignToken(payload: IPayloadJWT): IAuthResult {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return {
      user: payload,
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  async loginByForm(dto: TLoginByFormDTO): Promise<IAuthResult> {
    const userInfo = await this.userRepo.findUserByEmail(dto.email);
    if (!userInfo) throw new AppCodeError(EErrorCodes.USER_NOT_FOUND);

    if (!userInfo.passwordHash) throw new AppCodeError(EErrorCodes.AUTH_LOGIN_METHOD_MISMATCH);
    const isMatch = await verifyPassword(dto.password, userInfo.passwordHash);
    if (!isMatch) throw new AppCodeError(EErrorCodes.AUTH_WRONG_PASSWORD);

    const payload: IPayloadJWT = { id: userInfo.id, role: userInfo.role };
    return this.getAuthResultBySignToken(payload);
  }

  // TODO: do this function
  async logout(userId: string, refreshToken?: string): Promise<void> {}

  // TODO: do this function
  async refreshToken(oldRefreshToken: string): Promise<IAuthResult> {
    if (!oldRefreshToken) throw new AppCodeError(EErrorCodes.AUTH_MISSING_REFRESH_TOKEN);
    const decoded = jwt.verify(oldRefreshToken, JWT_SECRET);

    const payload = { id: (decoded as any).id, role: (decoded as any).role };
    return this.getAuthResultBySignToken(payload);
  }

  async getUrlredirectToGoogleLogin(): Promise<string> {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    // Tạo URL OAuth2 với các tham số bắt buộc
    const options = {
      redirect_uri: envConfig.auth.GOOGLE_REDIRECT_URI, // https://localhost:8000/auth/login/google/callback
      client_id: envConfig.auth.GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: ['profile', 'email'].join(' '),
      state: generateRandomString(), // Bảo vệ CSRF
    };
    return `${rootUrl}?${new URLSearchParams(options).toString()}`;
  }

  async loginByGoogle(code: string): Promise<IAuthResult> {
    throw new AppError('Route này không hỗ trợ nữa', 400, 'AUTH_NOT_SUPPOSE_ROUTE');
  }

  async loginWithOAuth(dto: TLoginByOAuthDTO): Promise<IAuthResult> {
    let payload: IPayloadJWT;
    const userIdentityInfo = await this.userIdentityRepo.findUserByProviderUser(dto);

    if (userIdentityInfo) {
      const userInfo = await this.userRepo.findUserById(userIdentityInfo.userId);
      if (userInfo) {
        payload = { id: userInfo.id, role: userInfo.role };
        return this.getAuthResultBySignToken(payload);
      } else {
        // TODO: think error
        throw new AppCodeError();
      }
    }

    const newUser = await runTransaction(async (uow) => {
      const userRepoTransaction = uow.getRepository(UserPrismaRepository);
      const userIdentityRepoTransaction = uow.getRepository(UserIdentityPrismaRepository);

      const newUserCreated = await userRepoTransaction.createUser({
        email: dto.email || null,
        fullname: dto.name,
      });

      await userIdentityRepoTransaction.create({
        provider: dto.provider,
        providerUserId: dto.providerUserId,
        email: dto.email || null,
        user: {
          connect: { id: newUserCreated.id },
        },
      });
      return newUserCreated;
    });
    payload = { id: newUser.id, role: newUser.role };
    return this.getAuthResultBySignToken(payload);
  }
}
