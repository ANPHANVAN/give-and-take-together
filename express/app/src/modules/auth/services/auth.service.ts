import { inject, injectable } from 'tsyringe';
import { TLoginByFormDTO } from '../dto/login.dto';
import { IAuthResult, IAuthService } from './IAuth.service';
import { IUserRepository } from '@/modules/user/repositories/IUser.repository';
import { AppCodeError } from '@/middlewares/errorHandler';
import { EErrorCodes } from '@/constants/errorCode';
import { verifyPassword } from '@/modules/shared/security/password';
import jwt from 'jsonwebtoken';
import envConfig from '@/config/envConfig';

const JWT_SECRET = envConfig.jwt.JWT_SECRET;

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject('IUserRepository') private userRepo: IUserRepository) {}

  async loginByForm(dto: TLoginByFormDTO): Promise<IAuthResult> {
    const userInfo = await this.userRepo.findUserByEmail(dto.email);
    if (!userInfo) throw new AppCodeError(EErrorCodes.USER_NOT_FOUND);

    const isMatch = await verifyPassword(dto.password, userInfo.passwordHash);
    if (!isMatch) throw new AppCodeError(EErrorCodes.AUTH_WRONG_PASSWORD);

    const payload = { id: userInfo.id, role: userInfo.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    const refeshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return {
      user: {
        id: userInfo.id,
        email: userInfo.email,
      },
      accessToken: token,
      refreshToken: refeshToken,
    };
  }

  // TODO: do this function
  async logout(userId: string, refreshToken?: string): Promise<void> {}

  // TODO: do this function
  async refreshToken(refreshToken: string): Promise<IAuthResult> {
    return {
      user: {
        id: 'mock',
        email: 'mock',
      },
      accessToken: 'mock',
      refreshToken: 'mock',
    };
  }
}
