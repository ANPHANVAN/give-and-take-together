import { OtpReset, Prisma } from '@/generated/client';
import { OtpResetCreateInput } from '@/generated/models';
import { PrismaService } from '@/infras/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpResetRepository {
  constructor(private prismaService: PrismaService) {}

  private getClient(tx?: Prisma.TransactionClient) {
    return tx ? tx : this.prismaService.getClient();
  }

  create(createOtp: OtpResetCreateInput): Promise<OtpReset> {
    return this.getClient().otpReset.create({
      data: createOtp,
    });
  }

  findByEmailAndOtp(email: string, otp: string): Promise<OtpReset | null> {
    return this.getClient().otpReset.findFirst({
      where: {
        email: email,
        otp: otp,
      },
    });
  }

  deleteByEmail(email: string): Promise<OtpReset> {
    return this.getClient().otpReset.delete({
      where: { email: email },
    });
  }

  deleteManyByEmail(email: string): Promise<Prisma.BatchPayload> {
    return this.getClient().otpReset.deleteMany({
      where: { email: email },
    });
  }
}
