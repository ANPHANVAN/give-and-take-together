import { PrismaClient } from '@/generated/client';

export interface IDatabase {
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  getClient?(): PrismaClient;
}
