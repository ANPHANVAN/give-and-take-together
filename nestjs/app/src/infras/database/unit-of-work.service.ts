import { Prisma } from '@/generated/client';
import { PrismaService } from './prisma.service';

export class UnitOfWork {
  constructor(private readonly prismaService: PrismaService) {}

  execute<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prismaService.getClient().$transaction(async (tx) => {
      return work(tx);
    });
  }
}
