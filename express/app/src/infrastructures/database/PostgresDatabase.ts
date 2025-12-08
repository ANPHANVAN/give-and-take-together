import { IDatabase } from './IDatabase';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/client';

export class PostgresDatabase implements IDatabase {
  private prisma: PrismaClient;

  constructor(uriConnect: string) {
    const adapter = new PrismaPg({ uriConnect });
    const globalForPrisma = globalThis as unknown as {
      prisma: PrismaClient | undefined;
    };

    this.prisma =
      globalForPrisma.prisma ??
      new PrismaClient({
        adapter,
        log: ['error', 'warn'], // optional
      });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = this.prisma;
    }
  }

  async connect(): Promise<boolean> {
    try {
      await this.prisma.$connect();
      console.log('Prisma connected to Postgres');
      return true;
    } catch (error) {
      console.error('Prisma failed to connect:', error);
      // process.exit(1);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      await this.prisma.$disconnect();
      console.log('Prisma disconnected to Postgres');
      return true;
    } catch (error) {
      console.error('Prisma failed to disconnect:', error);
      return false;
    }
  }

  getClient(): PrismaClient {
    return this.prisma;
  }
}
