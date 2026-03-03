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
  nodeEnv: getStringEnv('NODE_ENV'),
  nodePort: getNumberEnv('PORT'),
  frontendHost: getStringEnv('FRONTEND_HOST'),
  apiHost: getStringEnv('API_HOST'),
}));

export const postgresConfig = registerAs('postgres', () => ({
  user: getStringEnv('POSTGRES_USER'),
  password: getStringEnv('POSTGRES_PASSWORD'),
  db: getStringEnv('POSTGRES_DB'),
  host: getStringEnv('POSTGRES_HOST'),
  port: getNumberEnv('POSTGRES_PORT'),
  databaseUrl: getStringEnv('POSTGRES_DATABASE_URL'),
}));

export const redisConfig = registerAs('redis', () => ({
  url: getStringEnv('REDIS_URL'),
  host: getStringEnv('REDIS_HOST'),
  port: getNumberEnv('REDIS_PORT'),
  password: getStringEnv('REDIS_PASSWORD'),
  db: getNumberEnv('REDIS_DB'),
}));

export const authConfig = registerAs('auth', () => ({
  JWT_SECRET: getStringEnv('JWT_SECRET'),
  HASH_SALT: getNumberEnv('HASH_SALT'),
  HASH_PEPPER: getStringEnv('HASH_PEPPER'),

  GOOGLE_CLIENT_ID: getStringEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getStringEnv('GOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: getStringEnv('GOOGLE_REDIRECT_URI'),

  FACEBOOK_CLIENT_ID: getStringEnv('FACEBOOK_CLIENT_ID'),
  FACEBOOK_CLIENT_SECRET: getStringEnv('FACEBOOK_CLIENT_SECRET'),
}));

export const minioConfig = registerAs('minio', () => ({
  MINIO_REGION: getStringEnv('MINIO_REGION'),
  MINIO_ROOT_USER: getStringEnv('MINIO_ROOT_USER'),
  MINIO_ROOT_PASSWORD: getStringEnv('MINIO_ROOT_PASSWORD'),
  MINIO_ENDPOINT: getStringEnv('MINIO_ENDPOINT'),
  MINIO_PORT: getNumberEnv('MINIO_PORT'),
  MINIO_BUCKET: getStringEnv('MINIO_BUCKET'),
}));
