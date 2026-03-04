import { registerAs } from '@nestjs/config';

const getStringEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing/Invalid ENV variables: ${key}')}`);
  return value;
};

const getNumberEnv = (key: string): number => {
  const value = process.env[key];
  if (!value || isNaN(Number(value))) throw new Error(`Missing/Invalid ENV variables: ${key}')}`);
  return Number(value);
};

export const appConfig = registerAs('app', () => ({
  appNodeEnv: getStringEnv('NODE_ENV'),
  appPort: getNumberEnv('PORT'),
  appFrontendHost: getStringEnv('FRONTEND_HOST'),
  appApiHost: getStringEnv('API_HOST'),
}));

export const postgresConfig = registerAs('postgres', () => ({
  postgresUser: getStringEnv('POSTGRES_USER'),
  postgresPassword: getStringEnv('POSTGRES_PASSWORD'),
  postgresDb: getStringEnv('POSTGRES_DB'),
  postgresHost: getStringEnv('POSTGRES_HOST'),
  postgresPort: getNumberEnv('POSTGRES_PORT'),
  postgresDatabaseUrl: getStringEnv('POSTGRES_DATABASE_URL'),
}));

export const redisConfig = registerAs('redis', () => ({
  redisUrl: getStringEnv('REDIS_URL'),
  redisHost: getStringEnv('REDIS_HOST'),
  redisPort: getNumberEnv('REDIS_PORT'),
  redisPassword: getStringEnv('REDIS_PASSWORD'),
  redisDb: getNumberEnv('REDIS_DB'),
}));

export const authConfig = registerAs('auth', () => ({
  authJwtSecret: getStringEnv('JWT_SECRET'),
  authHashSalt: getNumberEnv('HASH_SALT'),
  authHashPepper: getStringEnv('HASH_PEPPER'),

  authGoogleClientId: getStringEnv('GOOGLE_CLIENT_ID'),
  authGoogleClientSecret: getStringEnv('GOOGLE_CLIENT_SECRET'),
  authGoogleRedirectUri: getStringEnv('GOOGLE_REDIRECT_URI'),

  authFacebookClientId: getStringEnv('FACEBOOK_CLIENT_ID'),
  authFacebookClientSecret: getStringEnv('FACEBOOK_CLIENT_SECRET'),
}));

export const minioConfig = registerAs('minio', () => ({
  minioStorageDriver: getStringEnv('STORAGE_DRIVER'),
  minioRegion: getStringEnv('MINIO_REGION'),
  minioRootUser: getStringEnv('MINIO_ROOT_USER'),
  minioRootPassword: getStringEnv('MINIO_ROOT_PASSWORD'),
  minioEndpoint: getStringEnv('MINIO_ENDPOINT'),
  minioPort: getNumberEnv('MINIO_PORT'),
  minioBucket: getStringEnv('MINIO_BUCKET'),
  minioMaxAttempts: getNumberEnv('MINIO_MAX_ATTEMPTS'),
}));
