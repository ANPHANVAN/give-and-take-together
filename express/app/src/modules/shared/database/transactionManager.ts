import { prisma } from '@/providers/database.provider';
import { UnitOfWork } from './unitOfWork';

export function runTransaction<T>(callback: (uow: UnitOfWork) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    const uow = new UnitOfWork(tx);
    return callback(uow);
  });
}
