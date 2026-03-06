import { Role } from '@/generated/enums';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IPayloadJWT } from './interfaces/IPayloadJWT';
import { JwtService } from '@nestjs/jwt';
import { LoginByFormDTO, LoginByOAuthDTO } from './dto/login.dto';
import { UsersRepository } from '../users/users.repository';
import { hashPassword, verifyPassword } from '@/common/utils/password';
import { UserIdentityRepository } from '../users/user-identity.repository';
import { UnitOfWork } from '@/infras/database/unit-of-work.service';
import { SetPasswordDTO } from './dto/set-password.dto';
import { PutPasswordDto } from './dto/put-password.dto';
import { ResetOtp } from './dto/reset-otp.dto';
import { OtpResetRepository } from './otp-reset.repository';
import { MailService } from '@/infras/mail/mail.service';

export interface IAuthResult {
  user: {
    id: string;
    role: Role;
    name?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UsersRepository,
    private userIdentityRepo: UserIdentityRepository,
    private otpResetRepo: OtpResetRepository,
    private unitOfWork: UnitOfWork,
    private mailService: MailService,
  ) {}

  getAuthResultBySignToken(payload: IPayloadJWT): IAuthResult {
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      user: payload,
      accessToken: token,
      refreshToken: refreshToken,
    };
  }

  async loginByForm(dto: LoginByFormDTO): Promise<IAuthResult> {
    const userInfo = await this.userRepo.findUserByEmail(dto.email);
    if (!userInfo) throw new NotFoundException({ message: 'Không tìm thấy Email' });

    if (!userInfo.passwordHash)
      throw new ConflictException('Tài khoản này đăng nhập bằng mạng xã hội. Vui lòng đăng nhập bằng Google/Facebook.');
    const isMatch = await verifyPassword(dto.password, userInfo.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Mật khẩu không chính xác');

    const payload: IPayloadJWT = { id: userInfo.id, role: userInfo.role };
    return this.getAuthResultBySignToken(payload);
  }

  refreshToken(oldRefreshToken: string): IAuthResult {
    if (!oldRefreshToken) throw new UnauthorizedException('Thiếu refresh token, vui lòng đăng nhập lại');
    const decoded = this.jwtService.verify<IPayloadJWT>(oldRefreshToken);

    const payload = { id: decoded.id, role: decoded.role };
    return this.getAuthResultBySignToken(payload);
  }

  async loginWithOAuth(dto: LoginByOAuthDTO): Promise<IAuthResult> {
    let payload: IPayloadJWT;
    const userIdentityInfo = await this.userIdentityRepo.findUserByProviderUser(dto);

    if (userIdentityInfo) {
      const userInfo = await this.userRepo.findUserById(userIdentityInfo.userId);
      if (userInfo) {
        payload = { id: userInfo.id, role: userInfo.role };
        return this.getAuthResultBySignToken(payload);
      } else {
        throw new NotFoundException('Không tìm thấy người dùng');
      }
    }

    const newUser = await this.unitOfWork.execute(async (uow) => {
      const newUserCreated = await this.userRepo.createUser(
        {
          email: dto.email || null,
          fullname: dto.name,
        },
        uow,
      );

      await this.userIdentityRepo.create({
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

  async setPasswordFirstTime(setPasswordDTO: SetPasswordDTO): Promise<void> {
    const userInfo = await this.userRepo.findUserById(setPasswordDTO.userId);
    if (!userInfo) throw new NotFoundException('Không tìm thấy người dùng');

    if (userInfo.passwordHash) throw new ConflictException('Tài khoản đã có mật khẩu');

    await this.userRepo.updateAllField(setPasswordDTO.userId, {
      passwordHash: await hashPassword(setPasswordDTO.newPassword),
    });
  }

  async changePassword(changePasswordDTO: PutPasswordDto): Promise<void> {
    const userInfo = await this.userRepo.findUserById(changePasswordDTO.userId);
    if (!userInfo) throw new NotFoundException('Không tìm thấy người dùng');

    if (!userInfo.passwordHash) throw new BadRequestException('Tài khoản chưa có mật khẩu.');

    const isMatch = await verifyPassword(changePasswordDTO.oldPassword, userInfo.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Mật khẩu không chính xác');

    await this.userRepo.updateAllField(changePasswordDTO.userId, {
      passwordHash: await hashPassword(changePasswordDTO.newPassword),
    });
  }

  async resetOtp(resetOtp: ResetOtp): Promise<void> {
    const userEmail = resetOtp.email;

    const userData = await this.userRepo.findUserByEmail(userEmail);
    if (!userData) throw new NotFoundException('Không tìm thấy người dùng');

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 character
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.otpResetRepo.deleteManyByEmail(userEmail);

    await this.otpResetRepo.create({
      email: userEmail,
      otp: otp,
      expiresAt: expiresAt,
    });

    await this.mailService.sendOtpResetPassword(otp, userEmail);
  }

  async setPasswordByOtp(email: string, otp: string, password: string): Promise<void> {
    const otpResetData = await this.otpResetRepo.findByEmailAndOtp(email, otp);
    if (!otpResetData || otpResetData.expiresAt < new Date())
      throw new BadRequestException('Chưa tạo OTP hoặc OTP hết hạn.');

    const hashedPassword = await hashPassword(password);
    const userData = await this.userRepo.findUserByEmail(otpResetData.email);
    if (!userData) throw new NotFoundException('Không tìm thấy người dùng');

    await this.userRepo.updateAllField(userData.id, {
      passwordHash: hashedPassword,
    });

    await this.otpResetRepo.deleteByEmail(email);
  }
}
