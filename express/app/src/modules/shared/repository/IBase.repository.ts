export interface IBaseRepository {
  transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
}
