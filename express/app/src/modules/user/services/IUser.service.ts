export interface IUserService {
  createUser(email: string): Promise<unknown>;
}
