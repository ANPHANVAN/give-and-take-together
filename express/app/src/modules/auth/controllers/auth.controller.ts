import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IAuthResult, IAuthService } from '../services/IAuth.service';
import { catchAsync } from '@/utils/catchAsync';
import { LoginByFormDTO } from '../dto/login.dto';
import { ETokenType } from '@/constants/tokenType.enum';

@injectable()
export class AuthController {
  constructor(@inject('IAuthService') private authService: IAuthService) {}

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
    return res.status(200).json({ message: 'Login success' });
  });

  refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newAuthResult = await this.authService.refreshToken(req.cookies.refreshToken);
    this.resTokenCookies(res, newAuthResult);
    return res.status(200).json({ message: newAuthResult });
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
    this.resTokenCookies(res, req.user as IAuthResult);
    return res.status(200).json({ message: 'newAuthResult' });
  });
}
