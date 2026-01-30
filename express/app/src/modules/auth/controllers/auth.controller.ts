import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IAuthService } from '../services/IAuth.service';
import { catchAsync } from '@/utils/catchAsync';
import { LoginByFormDTO } from '../dto/login.dto';
import { ETokenType } from '@/constants/tokenType.enum';

@injectable()
export class AuthController {
  constructor(@inject('IAuthService') private authService: IAuthService) {}

  loginByForm = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginDataParsed = LoginByFormDTO.parse(req.body);
    const authResult = await this.authService.loginByForm(loginDataParsed);
    res.cookie('accessToken', authResult.accessToken, {
      // domain: domain,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1 * 1 * 60 * 60 * 1000,
    });
    res.cookie('refeshToken', authResult.refreshToken, {
      // domain: domain,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api/auth/refesh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: 'Login success' });
  });

  refeshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newAuthResult = await this.authService.refreshToken(req.cookies.refeshToken);
    // const authResult = await this.authService.loginByForm(loginDataParsed);
    res.cookie(ETokenType.accessToken, newAuthResult.accessToken, {
      // domain: domain,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1 * 1 * 60 * 60 * 1000,
    });

    res.cookie(ETokenType.refreshToken, newAuthResult.refreshToken, {
      // domain: domain,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api/auth/refesh-token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: req.cookies });
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

  // async registerNew(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await this.authService.registerNew(req.body);
  //     res.status(201).json(result);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async login(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = await this.authService.login(req.body.username, req.body.password);

  //     const token = await this.authService.createJWT({ _id: userId });
  //     res.cookie('token', token, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: 'none',
  //       maxAge: 24 * 3600 * 1000,
  //     });

  //     res.status(200).json({ message: 'Đăng nhập thành công' });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async forgotPassword(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const result = await this.authService.sendOTP(req.body.email);
  //     res.status(200).json(result);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async resetPassword(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { email, otp, newPassword } = req.body;
  //     const result = await this.authService.resetPassword(email, otp, newPassword);
  //     res.status(200).json(result);
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}
