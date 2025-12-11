import { prisma } from '@/providers/datatbase.provider';
import { IBaseRepository } from './IBase.repository';

export class BaseRepository implements IBaseRepository {
  transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (tx) => fn(tx));
  }
}
