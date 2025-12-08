import dotenv from 'dotenv';
dotenv.config();

// interface AppConfig {
//   PORT: number;
//   NODE_ENV: string;
//   FRONTEND_HOST: string;
//   API_HOST: string;
// }

// interface PostgresConfig {
//   POSTGRES_USER: string;
//   POSTGRES_PASSWORD: string;
//   POSTGRES_DB: string;
//   POSTGRES_HOST: string;
//   POSTGRES_PORT: number;
//   POSTGRES_DATABASE_URL: string;
// }

// interface RedisConfig {
//   REDIS_HOST: string;
//   REDIS_PORT: number;
//   REDIS_PASSWORD: string;
//   REDIS_DB: number; // database number ( 0 - 15 )
// }

// interface AuthConfig {
//   GOOGLE_REDIRECT_URI: string;
//   GOOGLE_CLIENT_ID: string;
//   GOOGLE_CLIENT_SECRET: string;
//   GMAIL: string;
//   GMAIL_PASSWORD: string;
// }

// interface JWTConfig {
//   HASH_SALT: number;
//   HASH_PEPPER: string;
//   JWT_SECRET: string;
// }

// interface MinioConfig {
//   MINIO_REGION: string;
//   MINIO_ROOT_USER: string;
//   MINIO_ROOT_PASSWORD: string;
//   ENDPOINT: string;
//   PORT: number;
//   USE_SSL: boolean;
//   BUCKET_NAME: string;
//   ACCESS_KEY: string;
//   SECRET_KEY: string;
// }

// Helper để lấy env với default

const getEnv = (key: string, defaultValue?: string): string => {
  return process.env[key] ?? defaultValue ?? '';
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  return Number(process.env[key] ?? defaultValue);
};

export const appConfig = {
  PORT: getEnvNumber('PORT', 8000),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  FRONTEND_HOST: getEnv('FRONTEND_HOST', 'https://web.com'),
  API_HOST: getEnv('API_HOST', 'https://api.web.com'),
};

export const postgresConfig = {
  POSTGRES_USER: getEnv('POSTGRES_USER', 'username'),
  POSTGRES_PASSWORD: getEnv('POSTGRES_PASSWORD', 'postgresPassword'),
  POSTGRES_DB: getEnv('POSTGRES_DB', 'main_db'),
  POSTGRES_HOST: getEnv('POSTGRES_HOST', 'postgres'),
  POSTGRES_PORT: getEnvNumber('POSTGRES_PORT', 5432),
  POSTGRES_DATABASE_URL: getEnv('POSTGRES_DATABASE_URL', 'postgresql://u:pw@postgres:5432/db?schema=public'),
};

export const redisConfig = {
  REDIS_HOST: getEnv('REDIS_HOST', 'localhost'),
  REDIS_PORT: getEnvNumber('REDIS_PORT', 6379),
  REDIS_PASSWORD: getEnv('REDIS_PASSWORD', ''),
  REDIS_DB: getEnvNumber('REDIS_DB', 0),
};

export const jwtConfig = {
  HASH_SALT: getEnvNumber('HASH_SALT', 10),
  HASH_PEPPER: getEnv('HASH_PEPPER', 'examPepper'),
  JWT_SECRET: getEnv('JWT_SECRET', 'examplePassworkJwt'),
};

export const authConfig = {
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID', 'exampleGOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET', 'exampleGOOGLE_CLIENT_SECRET'),
  GOOGLE_REDIRECT_URI: getEnv('GOOGLE_REDIRECT_URI', 'exampleGOOGLE_REDIRECT_URI'),
  GMAIL: getEnv('GMAIL', 'example@gmail.com'),
  GMAIL_PASSWORD: getEnv('GMAIL_PASSWORD', 'exampleOneTimeGmailPassword'),
};

export const minioConfig = {
  MINIO_REGION: getEnv('MINIO_REGION', 'us-east-1'),
  MINIO_ROOT_USER: getEnv('MINIO_ROOT_USER', 'username'),
  MINIO_ROOT_PASSWORD: getEnv('MINIO_ROOT_PASSWORD', 'minioPassword'),
  ENDPOINT: getEnv('MINIO_ENDPOINT', 'localhost'),
  PORT: getEnvNumber('MINIO_PORT', 9000),
  USE_SSL: getEnv('MINIO_USE_SSL', 'false') === 'true',
  BUCKET_NAME: getEnv('MINIO_BUCKET', 'exam-platform'),
  ACCESS_KEY: getEnv('MINIO_ACCESS_KEY', 'minioadmin'),
  SECRET_KEY: getEnv('MINIO_SECRET_KEY', 'minioadmin'),
};

export const envConfig = {
  app: appConfig,
  postgres: postgresConfig,
  redis: redisConfig,
  jwt: jwtConfig,
  auth: authConfig,
  minio: minioConfig,
};

export default envConfig;
