import { Prisma, PrismaClient } from '@/generated/client';
import { prisma } from '@/providers/database.provider';

export type DbClient = PrismaClient | Prisma.TransactionClient;

export abstract class BaseRepository {
  constructor(protected readonly db: DbClient = prisma) {}
}
