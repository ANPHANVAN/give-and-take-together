import { inject, injectable } from 'tsyringe';
import { TLoginByFormDTO } from '../dto/login.dto';
import { IAuthResult, IAuthService } from './IAuth.service';
import { IUserRepository } from '@/modules/user/repositories/IUser.repository';
import { AppCodeError } from '@/middlewares/errorHandler';
import { EErrorCodes } from '@/constants/errorCode.enum';
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
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refeshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return {
      user: payload,
      accessToken: token,
      refreshToken: refeshToken,
    };
  }

  // TODO: do this function
  async logout(userId: string, refreshToken?: string): Promise<void> {}

  // TODO: do this function
  async refreshToken(oldRefreshToken: string): Promise<IAuthResult> {
    if (!oldRefreshToken) throw new AppCodeError(EErrorCodes.AUTH_MISSING_REFRESH_TOKEN);
    const decoded = jwt.verify(oldRefreshToken, JWT_SECRET);

    const payload = { id: (decoded as any).id, role: (decoded as any).role };
    const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return {
      user: payload,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
