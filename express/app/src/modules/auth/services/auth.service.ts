import bcrypt from 'bcrypt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import envConfig from '@/config/envConfig';
import { userRepository } from '../repository/user.repository';
import { userSecurityRepository } from '../repository/userSecurity.repository';
import { otpRepository } from '../repository/otp.repository';
import { AppError } from '@/middlewares/errorHandler';
import { generateRandomString } from '@/utils/auth';

export class AuthService {
  constructor() {}

  async registerNew(userData: any) {
    const username = userData.username.trim().toLowerCase();
    const email = userData.email.trim().toLowerCase();

    const exist = await userRepository.findByUsernameOrEmail(username, email);
    if (exist) throw new AppError('Username hoặc Email đã tồn tại', 409);

    const hashPassword = await bcrypt.hash(userData.password, envConfig.jwt.HASH_SALT);

    const user = await userRepository.createUser({ ...userData, username, email });
    await userSecurityRepository.createSecurity(user._id, username, hashPassword);

    return { message: 'Đăng Ký Thành Công' };
  }

  async login(username: string, password: string) {
    username = username.trim().toLowerCase();

    const sec = await userSecurityRepository.findByUsername(username);
    if (!sec) throw new AppError('Username không tồn tại', 404);

    const match = await bcrypt.compare(password, sec.hashPassword);
    if (!match) throw new AppError('Mật khẩu sai', 401);

    return sec._id.toString();
  }

  async createJWT(payload: any) {
    return jwt.sign(payload, envConfig.jwt.JWT_SECRET, { expiresIn: '24h' });
  }

  async sendOTP(email: string) {
    email = email.trim().toLowerCase();

    const user = await userRepository.findByUsernameOrEmail('', email);
    if (!user) throw new AppError('Email không tồn tại', 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await otpRepository.removeAll(email);
    await otpRepository.create(email, otp, expiresAt);

    await this.sendEmail(email, otp, user.username);

    return { message: 'OTP đã gửi' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const record = await otpRepository.find(email, otp);

    if (!record || record.expiresAt < new Date()) throw new AppError('OTP sai hoặc hết hạn', 400);

    const user = await userRepository.findByUsernameOrEmail('', email);
    if (!user) throw new AppError('User không tồn tại', 404);

    const hashPassword = await bcrypt.hash(newPassword, envConfig.jwt.HASH_SALT);
    await userSecurityRepository.updatePassword(user._id, hashPassword);

    await otpRepository.removeAll(email);

    return { message: 'Đổi mật khẩu thành công' };
  }

  async sendEmail(email: string, otp: string, username: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: envConfig.auth.GMAIL,
        pass: envConfig.auth.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Mã OTP của bạn',
      text: `Username: ${username}\nOTP: ${otp}`,
    });
  }
}
