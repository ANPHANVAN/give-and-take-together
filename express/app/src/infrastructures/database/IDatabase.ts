export interface IDatabase {
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  getClient?(): any;
}
