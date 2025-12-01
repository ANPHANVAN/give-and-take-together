import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import envConfig from '../config/envConfig';
import { IUser, UserModel } from '../models/userModel';
import { IUserSecurity, UserSecurity } from '../models/userSecurityModel';
import { OtpResetModel } from '../models/otpResetModel';
import { generateRandomString } from '../utils/auth';
import axios from 'axios';
import { AppError } from '../middlewares/errorHandler';
const domain = envConfig.FRONTEND_HOST.split('//')[1];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${envConfig.GMAIL}`,
    pass: `${envConfig.GMAIL_PASSWORD}`,
  },
});

class AuthController {
  // [GET] /auth/logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // res.clearCookie('token');
      // res.status(300).redirect('/auth/login');
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: domain,
      });
      return res.status(200).json({ message: 'Logged out' });
    } catch (error) {
      next(error);
    }
  }

  // [GET] /auth/login/google
  async redirectToGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      // Tạo URL OAuth2 với các tham số bắt buộc
      const options = {
        redirect_uri: envConfig.GOOGLE_REDIRECT_URI, // https://localhost:8000/auth/login/google/callback
        client_id: envConfig.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: ['profile', 'email'].join(' '),
        state: generateRandomString(), // Bảo vệ CSRF
      };
      const url = `${rootUrl}?${new URLSearchParams(options).toString()}`;
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  // [GET] /auth/login/google/callback
  async googleCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    if (!code) return res.status(400).json({ message: 'Thiếu mã ủy quyền!' });

    try {
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code: code,
        client_id: envConfig.GOOGLE_CLIENT_ID,
        client_secret: envConfig.GOOGLE_CLIENT_SECRET,
        redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      const accessToken = tokenResponse.data.access_token;

      const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { sub, email, name } = userInfoResponse.data;

      let user = await UserModel.findOne({ oauthId: sub, provider: 'google' });
      if (!user) {
        user = await UserModel.create({
          oauthId: sub,
          provider: 'google',
          email: email,
          username: email,
          fullname: name,
        });
      }

      const payload = { userId: user._id, email: user.email, role: user.role };
      const token = jwt.sign(payload, envConfig.JWT_SECRET, { expiresIn: '24h' });

      const isDevelopment = envConfig.NODE_ENV === 'development';
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        domain: isDevelopment ? 'localhost' : domain,
        secure: isDevelopment ? false : true,
        sameSite: isDevelopment ? 'lax' : 'none',
      });
      res.status(200).redirect(`${envConfig.FRONTEND_HOST}/`);
    } catch (error) {
      console.error('OAuth Error:', error);
      res.redirect(`${envConfig.FRONTEND_HOST}/login?error=auth_failed`);
    }
  }

  // [POST] /auth/register-new
  async registerNew(req: Request, res: Response, next: NextFunction) {
    try {
      let registerInformation = req.body;
      let { confirmPassword, ...userData } = registerInformation;

      userData.username = userData.username.trim().toLowerCase();
      userData.email = userData.email.trim().toLowerCase();

      // Kiểm tra username hoặc email đã tồn tại
      let existingUser = await UserModel.findOne({
        $or: [{ username: userData.username }, { email: userData.email }],
      });

      if (existingUser) {
        let message = existingUser.username === userData.username ? 'Username Đã Tồn Tại' : 'Email Đã Tồn Tại';
        return res.status(409).json({ message: message });
      }

      const hashPassword = await bcrypt.hash(userData.password, envConfig.HASH_SALT);

      let user = await UserModel.create(userData);
      await UserSecurity.create({
        _id: user._id,
        username: user.username,
        hashPassword: hashPassword,
      });

      res.status(201).json({ message: 'Đăng Ký Thành Công!', redirectTo: '/auth/login' });
    } catch (error) {
      next(error);
    }
  }

  // [POST] /auth/login/authentication
  async authentication(req: Request, res: Response, next: NextFunction) {
    try {
      let loginInformation = req.body;
      loginInformation.username = loginInformation.username.trim().toLowerCase();
      let result: IUserSecurity[] = await UserSecurity.find({ username: loginInformation.username });
      if (result.length === 0) {
        res.status(404).json({ message: `Username Không Tồn Tại` });
        return;
      }
      let isMatch = await bcrypt.compare(loginInformation.password, result[0]!.hashPassword);

      if (!isMatch) {
        res.status(401).json({ message: `Mật Khẩu Không Chính Xác` });
        return;
      }
      const userIdAccessApi = result[0]!._id.toString();
      const userData: IUser | null = await UserModel.findById(userIdAccessApi, { _id: 1, role: 1 });

      if (!userData) {
        return res.status(404).json({ message: 'User not found!' });
      }

      if (!userData.role) {
        return res.status(404).json({ message: 'Dont found this user!' });
      }

      const token = jwt.sign({ _id: userIdAccessApi, role: userData.role }, envConfig.JWT_SECRET, {
        expiresIn: '24h',
      });

      res.cookie('token', token, {
        domain: domain,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      res.status(200).redirect('/');
    } catch (err) {
      next(err);
    }
  }

  // [POST] /auth/api/forgot-password
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { email } = req.body;
      email = email.trim().toLowerCase();
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        res.status(404).json({ message: 'Dont Exit this email' });
        return;
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 số
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
      await OtpResetModel.deleteMany({ email });

      const otpSet = await OtpResetModel.create({
        email: email,
        otp: otp,
        expiresAt: expiresAt,
      });
      if (!otpSet) {
        console.error('Dont create otp reset for email: ', email);
        res.status(500).json({ message: 'Dont create otp reset ' });
        return;
      }
      await transporter.sendMail({
        from: `"Trung Tâm Hiếu Học" <${envConfig.GMAIL}>`,
        to: email,
        subject: '🔐 Yêu cầu đặt lại mật khẩu - OTP của bạn',
        text: `Username của bạn là: ${user.username} \nMã OTP của bạn là: ${otp} (hết hạn sau 15 phút)`, // fallback nếu không đọc được HTML
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #007bff;">👋 Xin chào,</h2>
                <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản trên <strong>Website Trung Tâm Hiếu Học</strong>.</p>
                <p style="font-size: 16px;">Username của bạn là:</p>
                <div style="font-size: 28px; font-weight: bold; background: #f8f9fa; padding: 12px 20px; border-radius: 5px; text-align: center; letter-spacing: 2px;">
                    ${user.username}
                </div>
                <p style="font-size: 16px;">Mã OTP của bạn là:</p>
                <div style="font-size: 28px; font-weight: bold; background: #f8f9fa; padding: 12px 20px; border-radius: 5px; text-align: center; letter-spacing: 2px;">
                    ${otp}
                </div>
                <p>Mã OTP này sẽ <strong>hết hạn sau 15 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                <hr />
                <p style="font-size: 13px; color: #777;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p style="font-size: 13px; color: #777;">Trân trọng,<br/>Đội ngũ Trung Tâm Hiếu Học</p>
                </div>
            `,
      });

      res.status(200).json({ message: 'OTP đã gửi tới email' });
    } catch (error) {
      if (error instanceof AppError) {
        error.detailBackendErrorMessage = 'Rest OTP API Failure!';
        return next(error);
      }
      next(error);
    }
  }

  // [POST] /auth/api/reset-password/
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, otp, newPassword } = req.body;
      email = email.trim().toLowerCase();
      const record = await OtpResetModel.findOne({ email, otp });
      if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
      }
      const hashPassword = await bcrypt.hash(newPassword, envConfig.HASH_SALT);

      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'Dont found user form this email' });
      }
      const changePassword = await UserSecurity.findByIdAndUpdate(user._id, {
        hashPassword: hashPassword,
      });
      if (!changePassword) {
        return res.status(500).json({ message: 'Failure to change password' });
      }
      await OtpResetModel.deleteMany({ email });

      res.status(200).json({ message: 'Update Success' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * check username exit
   * check current user connect API Is UserId
   * check oldpassword match with user type oldpassword
   * hash newpassword
   * change newPassword
   * @param {username, oldPassword, newPassword} req.body
   */
  // [PUT] /auth/change-password
  async putPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { username, oldPassword, newPassword /* , confirmPassword */ } = req.body;
      const currentUserId = req.user._id;

      username = username.trim().toLowerCase();
      let result = await UserSecurity.findOne({ username: username });
      if (!result) {
        res.status(404).json({ message: `Username Không Tồn Tại Trong Hệ Thống!` });
        return;
      }
      const userId = result._id.toString();
      if (!(currentUserId == userId)) {
        return res.status(403).json({ message: 'Bạn Không Có Quyền Đổi Mật Khẩu Cho Người Dùng Khác!' });
      }

      let isMatch = await bcrypt.compare(oldPassword, result.hashPassword);
      if (!isMatch) {
        res.status(401).json({ message: `Mật Khẩu Không Chính Xác!` });
        return;
      }

      const hashPassword = await bcrypt.hash(newPassword, envConfig.HASH_SALT);

      const changePassword = await UserSecurity.findByIdAndUpdate(userId, {
        hashPassword: hashPassword,
      });
      if (!changePassword) {
        return res.status(500).json({ message: 'Thất bại khi thay đổi mật khẩu!' });
      }
      res.status(200).json({ message: 'Cập nhật mật khẩu thành công!' });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
