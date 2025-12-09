export interface IUserRepository {
  createUser(email: string): Promise<any>;
}
