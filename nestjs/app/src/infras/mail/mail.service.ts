import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private config: ConfigService,
  ) {}

  async sendWelcome(email: string) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Welcome',
      text: 'Welcome to our system',
    });
  }

  async sendOtpResetPassword(otp: string, userEmail: string) {
    const gmailHost = this.config.getOrThrow<string>('auth.authGmail');
    await this.mailer.sendMail({
      from: `"Give And Take Together" <${gmailHost}>`,
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
  }
}
