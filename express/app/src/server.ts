// Dependency Injection
import 'reflect-metadata';

import http from 'http';
import app from './app';
import envConfig from './config/envConfig';
import { storage } from '@/providers/storage.provider';
import { database } from '@/providers/database.provider';

const server = http.createServer(app);

async function checkStorage() {
  try {
    console.log('🔍 Checking storage health...');

    const ok = await storage.healthCheck();
    if (!ok) {
      console.error('❌ Storage connection failed');
      throw new Error('Storage health check failed');
    }

    console.log('✅ Storage OK — ensuring bucket...');
    await storage.ensureBucket();
    console.log('📦 Bucket ready');
  } catch (error) {
    console.error('❌ Storage connection failed' + error);
  }
}

async function checkDatabase() {
  try {
    console.log('🔍 Checking database health...');

    const ok = await database.connect();
    if (!ok) {
      console.error('❌ Database connection failed');
      throw new Error('Database health check failed');
    }

    console.log('✅ Database OK');
  } catch (error) {
    console.error('❌ Database connection failed' + error);
  }
}

async function bootstrap() {
  console.log('🚀 Bootstrapping application...');

  await Promise.all([checkStorage(), checkDatabase()]);

  console.log('✨ Bootstrap complete');
}

async function startServer() {
  console.log('🚀 Starting server...');

  await bootstrap();

  server.listen(envConfig.app.PORT, () => {
    console.log(`✅ Server running at ${envConfig.app.API_HOST}:${envConfig.app.PORT}`);
  });
}

/**
 * GLOBAL ERROR HANDLERS
 * Giúp server không crash ngầm
 */

process.on('unhandledRejection', (reason) => {
  console.error('🛑 Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('🛑 Uncaught Exception:', err);
  process.exit(1);
});

// Run app
startServer().catch((err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
