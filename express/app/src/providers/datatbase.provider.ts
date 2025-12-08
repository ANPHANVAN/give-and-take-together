import { DatabaseFactory } from '@/infrastructures/database/DatabaseFactory';
import envConfig from '@/config/envConfig';

export const database = DatabaseFactory.create('postgres', {
  uriConnect: envConfig.postgres.POSTGRES_DATABASE_URL,
});
