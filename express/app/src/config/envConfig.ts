import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGO_HOST: string;
  MONGO_INITDB_ROOT_USERNAME: string;
  MONGO_INITDB_ROOT_PASSWORD: string;
  MONGO_LINK: string;
  HASH_SALT: number;
  JWT_SECRET: string;
  FRONTEND_HOST: string;
  API_HOST: string;
  GMAIL: string;
  GMAIL_PASSWORD: string;
  GOOGLE_REDIRECT_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

const envConfig: EnvConfig = {
  PORT: Number(process.env.PORT) || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_HOST: process.env.MONGO_HOST || 'mongodb',
  MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME || 'example_user',
  MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD || 'example_password',
  MONGO_LINK:
    process.env.MONGO_LINK ||
    'mongodb://example_user:example_password@mongodb:27017/onlineExamPlatform?authSource=admin&replicaSet=rs0',
  HASH_SALT: Number(process.env.HASH_SALT) || 10,
  JWT_SECRET: process.env.JWT_SECRET || 'examplePassworkJwt',
  FRONTEND_HOST: process.env.FRONTEND_HOST || 'https://web.com',
  API_HOST: process.env.API_HOST || 'https://api.web.com',
  GMAIL: process.env.GMAIL || 'example@gmail.com',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || 'exampleOneTimeGmailPassword',
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || 'exampleGOOGLE_REDIRECT_URI',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'exampleGOOGLE_CLIENT_ID',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
};

export default envConfig;
