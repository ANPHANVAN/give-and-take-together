import { IDatabase } from './IDatabase';
import { PostgresDatabase } from './PostgresDatabase';
import { MongoDatabase } from './MongoDatabase';

type TDatabaseProvider = 'postgres' | 'mongodb';

export class DatabaseFactory {
  private static database: Map<TDatabaseProvider, IDatabase> = new Map();

  public static create(provider: TDatabaseProvider, config: { uriConnect: string }): IDatabase {
    if (this.database.has(provider)) return this.database.get(provider)!;

    switch (provider) {
      case 'postgres':
        this.database.set(provider, new PostgresDatabase(config.uriConnect));
        return this.database.get(provider)!;

      case 'mongodb':
        this.database.set(provider, new MongoDatabase(config.uriConnect));
        return this.database.get(provider)!;

      default:
        throw new Error(`Unknown database provider: ${provider}`);
    }
  }
}
