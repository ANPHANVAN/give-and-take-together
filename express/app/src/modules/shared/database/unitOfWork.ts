import { Prisma } from '@/generated/client';
import { BaseRepository } from './base.repository';
import { DbClient } from './base.repository';

type RepositoryClass<T extends BaseRepository> = new (db: DbClient) => T;

export class UnitOfWork {
  private repositories: Map<string, BaseRepository>;
  constructor(private readonly tx: Prisma.TransactionClient) {
    this.repositories = new Map();
  }

  getRepository<T extends BaseRepository>(repoClass: RepositoryClass<T>) {
    const className = repoClass.name;
    if (this.repositories.has(className)) {
      return this.repositories.get(className) as T;
    }

    const repoInstance = new repoClass(this.tx);
    this.repositories.set(className, repoInstance);
    return repoInstance;
  }
}
