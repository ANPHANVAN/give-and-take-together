import { IUserService } from './IUser.service';
import { IUserRepository } from '../repository/IUser.repository';

export class UserService implements IUserService {
  constructor(private userRepo: IUserRepository) {}
  createUser(email: string) {
    return this.userRepo.createUser(email);
  }
}
