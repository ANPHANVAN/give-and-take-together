import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IAuthResult, AuthService } from './auth.service';
import { catchAsync } from '@/utils/catchAsync';
import { LoginByFormDTO } from './dto/login.dto';
import { ETokenType } from '@/constants/tokenType.enum';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { SetPasswordDTO } from './dto/setPassword.dto';
import { AppCodeError } from '@/middlewares/errorHandler';
import { EErrorCodes } from '@/constants/errorCode.enum';
import { ResetOtp } from './dto/resetOtp.dto';
import { ResetPasswordByOtp } from './dto/resetPasswordByOtp.dto';

@injectable()
export class AuthController {
  constructor(@inject('AuthService') private authService: AuthService) {}

  resTokenCookies = (res: Response, authResult: IAuthResult) => {
    res.cookie(ETokenType.accessToken, authResult.accessToken, {
      // domain: domain,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1 * 1 * 60 * 60 * 1000,
    });
    res.cookie(ETokenType.refreshToken, authResult.refreshToken, {
      // domain: domain,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api/auth/refresh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  };

  loginByForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginDataParsed = LoginByFormDTO.parse(req.body);
    const authResult = await this.authService.loginByForm(loginDataParsed);
    this.resTokenCookies(res, authResult);
    return res.status(200).json({ message: 'Login by form successful' });
  });

  refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newAuthResult = await this.authService.refreshToken(req.cookies.refreshToken);
    this.resTokenCookies(res, newAuthResult);
    return res.status(200).json({ message: 'Login by OAuth successfull', user: newAuthResult.user });
  });

  clearToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie(ETokenType.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // domain: domain,
    });
    res.clearCookie(ETokenType.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // domain: domain,
    });
    return res.status(200).json({ message: 'Logged out' });
  });

  loginWithOAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authResult = req.user as IAuthResult;
    this.resTokenCookies(res, authResult);
    return res.status(200).json({ message: 'Login by OAuth successfull', user: authResult.user });
  });

  putPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) throw new AppCodeError(EErrorCodes.AUTH_UNAUTHORIZED);

    const changePasswordDTO = ChangePasswordDTO.parse({ ...req.body, userId: userId });
    await this.authService.changePassword(changePasswordDTO);
    return res.status(200).json({ message: 'Change password successful' });
  });

  setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) throw new AppCodeError(EErrorCodes.AUTH_UNAUTHORIZED);

    const setPassBody = SetPasswordDTO.parse({ ...req.body, userId: userId });
    await this.authService.setPasswordFirstTime(setPassBody);
    return res.status(201).json({ message: 'Tạo mật khẩu lần đầu thành công' });
  });

  resetOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const resetOtp = ResetOtp.parse(req.body);
    await this.authService.resetOtp(resetOtp);
    return res.status(201).json({ message: 'Otp thay đổi mật khẩu đã được gửi về email' });
  });

  setPasswordByOTP = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, password } = ResetPasswordByOtp.parse(req.body);
    await this.authService.setPasswordByOtp(email, otp, password);
    return res.status(200).json({ message: 'Mật khẩu đã thay đổi thành công' });
  });
}
