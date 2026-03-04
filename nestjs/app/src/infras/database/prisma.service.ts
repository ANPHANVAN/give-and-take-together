import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prisma: PrismaClient;
  constructor(private config: ConfigService) {
    const adapter = new PrismaPg({ connectionString: this.config.get<string>('postgres.postgresDatabaseUrl') });
    this.prisma = new PrismaClient({
      adapter: adapter,
    });
  }

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      await this.prisma.$queryRaw`SELECT 1`;

      console.log('Database Connection Successful');
    } catch (error) {
      console.error('Database connection failed');
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('Prisma Disconnection Successful');
  }

  getClient() {
    return this.prisma;
  }
}
