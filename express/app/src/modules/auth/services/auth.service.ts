import { inject, injectable } from 'tsyringe';
import { TLoginByFormDTO, TLoginByOAuthDTO } from '../dto/login.dto';
import { IAuthResult, IAuthService } from './IAuth.service';
import { IUserRepository } from '@/modules/user/repositories/IUser.repository';
import { AppCodeError, AppError } from '@/middlewares/errorHandler';
import { EErrorCodes } from '@/constants/errorCode.enum';
import { hashPassword, verifyPassword } from '@/modules/shared/security/password';
import jwt from 'jsonwebtoken';
import envConfig from '@/config/envConfig';
import { generateRandomString } from '@/utils/auth';
import { Role } from '@/generated/enums';
import { IUserIdentityRepository } from '@/modules/user/repositories/IUserIdentity.repository';
import { runTransaction } from '@/modules/shared/database/transactionManager';
import { UserPrismaRepository } from '@/modules/user/repositories/prisma/user.prisma.repository';
import { UserIdentityPrismaRepository } from '@/modules/user/repositories/prisma/userIdentity.repository';
import { ChangePasswordDTO, TChangePasswordDTO } from '../dto/changePassword.dto';
import { TSetPasswordDTO } from '../dto/setPassword.dto';
import { TResetOtp } from '../dto/resetOtp.dto';
import { IOtpResetRepository } from '../repositories/IOtpReset.repository';
import nodemailer from 'nodemailer';

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
    @inject('IOtpResetRepository') private otpResetRepo: IOtpResetRepository,
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

  async setPasswordFirstTime(setPasswordDTO: TSetPasswordDTO): Promise<void> {
    const userInfo = await this.userRepo.findUserById(setPasswordDTO.userId);
    if (!userInfo) throw new AppCodeError(EErrorCodes.USER_NOT_FOUND);

    if (userInfo.passwordHash) throw new AppCodeError(EErrorCodes.AUTH_PASSWORD_ALREADY_SET);

    await this.userRepo.updateAllField(setPasswordDTO.userId, {
      passwordHash: await hashPassword(setPasswordDTO.newPassword),
    });
  }

  async changePassword(changePasswordDTO: TChangePasswordDTO): Promise<void> {
    const userInfo = await this.userRepo.findUserById(changePasswordDTO.userId);
    if (!userInfo) throw new AppCodeError(EErrorCodes.USER_NOT_FOUND);

    if (!userInfo.passwordHash) throw new AppCodeError(EErrorCodes.AUTH_PASSWORD_NOT_SET);

    const isMatch = await verifyPassword(changePasswordDTO.oldPassword, userInfo.passwordHash);
    if (!isMatch) throw new AppCodeError(EErrorCodes.AUTH_WRONG_PASSWORD);

    this.userRepo.updateAllField(changePasswordDTO.userId, {
      passwordHash: await hashPassword(changePasswordDTO.newPassword),
    });
  }

  async resetOtp(resetOtp: TResetOtp): Promise<void> {
    const userEmail = resetOtp.email;

    const userData = this.userRepo.findUserByEmail(userEmail);
    if (!userData) throw new AppCodeError(EErrorCodes.USER_NOT_FOUND);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 character
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.otpResetRepo.deleteManyByEmail(userEmail);

    await this.otpResetRepo.create({
      email: userEmail,
      otp: otp,
      expiresAt: expiresAt,
    });

    await sendOtpResetPassword(userEmail, otp);
  }

  async setPasswordByOtp(email: string, otp: string, password: string): Promise<void> {
    const otpResetData = await this.otpResetRepo.findByEmailAndOtp(email, otp);
    if (!otpResetData || otpResetData.expiresAt < new Date())
      throw new AppCodeError(EErrorCodes.AUTH_OTP_NOT_FOUND_OR_EXPRIRED);

    const hashedPassword = await hashPassword(password);
    const userData = await this.userRepo.findUserByEmail(otpResetData.email);
    if (!userData) throw new AppCodeError(EErrorCodes.USER_NOT_FOUND);

    await this.userRepo.updateAllField(userData.id, {
      passwordHash: hashedPassword,
    });

    await this.otpResetRepo.deleteByEmail(email);
  }
}

const sendOtpResetPassword = async (userEmail: string, otp: string) => {
  const GMAIL_HOST = envConfig.auth.GMAIL;
  const GMAIL_PASSWORD = envConfig.auth.GMAIL_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${GMAIL_HOST}`,
      pass: `${GMAIL_PASSWORD}`,
    },
  });
  await transporter.sendMail({
    from: `"Give And Take Together" <${GMAIL_HOST}>`,
    to: userEmail,
    subject: '🔐 Yêu cầu đặt lại mật khẩu - OTP của bạn',
    text: `Mã OTP của bạn là: ${otp} (hết hạn sau 15 phút)`, // fallback nếu không đọc được HTML
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #007bff;">👋 Xin chào,</h2>
        <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản trên <strong>Website Give And Take Together</strong>.</p>
        <p style="font-size: 16px;">Mã OTP của bạn là:</p>
        <div style="font-size: 28px; font-weight: bold; background: #f8f9fa; padding: 12px 20px; border-radius: 5px; text-align: center; letter-spacing: 2px;">
            ${otp}
        </div>
        <p>Mã OTP này sẽ <strong>hết hạn sau 15 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        <hr />
        <p style="font-size: 13px; color: #777;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p style="font-size: 13px; color: #777;">Trân trọng,<br/>Đội ngũ Give And Take Together</p>
        </div>
    `,
  });
};
