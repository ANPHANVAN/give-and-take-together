import { OtpResetModel } from '@/models/otpResetModel';

export class OtpRepository {
  find(email: string, otp: string) {
    return OtpResetModel.findOne({ email, otp });
  }

  create(email: string, otp: string, expiresAt: Date) {
    return OtpResetModel.create({ email, otp, expiresAt });
  }

  removeAll(email: string) {
    return OtpResetModel.deleteMany({ email });
  }
}
export const otpRepository = new OtpRepository();
