import { OtpReset, Prisma, User } from '@/generated/client';
import { BaseRepository } from '@/modules/shared/database/base.repository';
import { injectable } from 'tsyringe';
import { IOtpResetRepository } from '../IOtpReset.repository';

@injectable()
export class OtpResetPrismaRepository extends BaseRepository implements IOtpResetRepository {
  create(otpresetInput: Prisma.OtpResetCreateInput): Promise<OtpReset> {
    return this.db.otpReset.create({ data: otpresetInput });
  }

  findByEmailAndOtp(email: string, otp: string): Promise<OtpReset | null> {
    return this.db.otpReset.findFirst({
      where: {
        email: email,
        otp: otp,
      },
    });
  }

  deleteByEmail(email: string): Promise<OtpReset> {
    return this.db.otpReset.delete({
      where: { email: email },
    });
  }

  deleteManyByEmail(email: string): Promise<Prisma.BatchPayload> {
    return this.db.otpReset.deleteMany({
      where: { email: email },
    });
  }
}
