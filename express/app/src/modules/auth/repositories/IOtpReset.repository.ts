import { OtpReset, Prisma } from '@/generated/client';
import { OtpResetCreateInput } from '@/generated/models';

export interface IOtpResetRepository {
  create(otpResetInput: OtpResetCreateInput): Promise<OtpReset>;
  deleteByEmail(email: string): Promise<OtpReset>;
  deleteManyByEmail(email: string): Promise<Prisma.BatchPayload>;
  findByEmailAndOtp(email: string, otp: string): Promise<OtpReset | null>;
}
