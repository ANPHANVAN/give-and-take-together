import { TransactionClient } from '@/generated/internal/prismaNamespace';

export interface IUserRepository {
  createUser(email: string, tx?: any): Promise<any>;
  createNewRepo(txCallback: TransactionClient): any;
}
