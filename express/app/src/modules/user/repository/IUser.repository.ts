import { IBaseRepository } from '@/modules/shared/repository/IBase.repository';

export interface IUserRepository extends IBaseRepository {
  createUser(email: string, tx?: any): Promise<any>;
}
