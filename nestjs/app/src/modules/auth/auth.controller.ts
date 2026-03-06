import { Body, Controller, Get, Post, Put, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SetPasswordDTO } from './dto/set-password.dto';
import { ResetOtp } from './dto/reset-otp.dto';
import { LoginByFormDTO } from './dto/login.dto';
import { PutPasswordDto } from './dto/put-password.dto';
import { ResetPasswordByOtp } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationGuard } from './guards/authentication.guard';
import { IAuthResult } from './interfaces/IAuthResult';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setTokenCookies(res: Response, authResult: IAuthResult) {
    res.cookie('accessToken', authResult.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', authResult.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  loginWithOAuth(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const authResult = req.user;
    if (!authResult) throw new UnauthorizedException('Cần đăng nhập bằng Oauth');

    this.setTokenCookies(res, authResult);

    return {
      message: 'OAuth login successful',
      user: authResult.user,
    };
  }

  @Post('login')
  async loginByForm(@Body() dto: LoginByFormDTO, @Res({ passthrough: true }) res: Response) {
    const authResult = await this.authService.loginByForm(dto);
    this.setTokenCookies(res, authResult);
    return { user: authResult.user };
  }

  @Post('refresh')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken: string | undefined = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('Không có refresh Token');
    const authResult = this.authService.refreshToken(refreshToken);

    this.setTokenCookies(res, authResult);
    return {
      message: 'Refresh token successful',
      user: authResult.user,
    };
  }

  @Get('me')
  @UseGuards(AuthenticationGuard)
  getMe(@Req() req: Request) {
    return req.userInfo;
  }

  @Post('logout')
  @UseGuards(AuthenticationGuard)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return {
      message: 'Logged out',
    };
  }

  @Put('password')
  @UseGuards(AuthenticationGuard)
  async changePassword(@Req() req: Request, @Body() dto: PutPasswordDto) {
    const userId = req.userInfo?.id;
    if (!userId) throw new UnauthorizedException();
    await this.authService.changePassword({
      ...dto,
      userId,
    });

    return {
      message: 'Change password successful',
    };
  }

  @Post('password/initialize')
  @UseGuards(AuthenticationGuard)
  async setPassword(@Req() req: Request, @Body() dto: SetPasswordDTO) {
    const userId = req.userInfo?.id;
    if (!userId) throw new UnauthorizedException();
    await this.authService.setPasswordFirstTime({
      ...dto,
      userId,
    });

    return {
      message: 'Password created successfully',
    };
  }

  // post or put
  @Post('password/reset')
  async resetPasswordByOtp(@Body() dto: ResetPasswordByOtp) {
    const { email, otp, password } = dto;

    await this.authService.setPasswordByOtp(email, otp, password);

    return {
      message: 'Password reset successful',
    };
  }

  @Post('password/otp')
  async resetOtp(@Body() dto: ResetOtp) {
    await this.authService.resetOtp(dto);

    return {
      message: 'OTP sent to email',
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const authResult = req.user;
    if (!authResult) throw new UnauthorizedException();
    this.setTokenCookies(res, authResult);
    return res.status(200).json({ message: 'Login by OAuth successfull', user: authResult.user });
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookCallback(@Req() req: Request, @Res() res: Response) {
    const authResult = req.user as IAuthResult;
    this.setTokenCookies(res, authResult);
    return res.status(200).json({ message: 'Login by Facebook successfull', user: authResult.user });
  }
}
