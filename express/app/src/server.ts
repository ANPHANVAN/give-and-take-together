import http from 'http';
import app from './app';
import envConfig from './config/envConfig';
import { storage } from '@/providers/storage.provider';
import { database } from '@/providers/database.provider';

const server = http.createServer(app);

async function checkStorage() {
  try {
    const ok = await storage.healthCheck();
    if (!ok) {
      throw new Error('Storage healthCheck failure');
    }

    await storage.ensureBucket();
    console.log('Bucket ready');
    console.log('Connect Storage Successful');
  } catch (error) {
    console.error('Connect Storage Failure \n' + error);
  }
}

async function checkDatabase() {
  try {
    const ok = await database.connect();
    if (!ok) {
      throw new Error('Database healthCheck failed');
    }

    console.log('Database Connect Successful');
  } catch (error) {
    console.error('Database connect failure');
    throw error;
  }
}

export async function bootstrap() {
  await Promise.all([checkStorage(), checkDatabase()]);
}

async function startServer() {
  console.log('Starting server------------------------------------');

  await bootstrap();

  server.listen(envConfig.app.PORT, () => {
    console.log(`Server running at ${envConfig.app.API_HOST} at port ${envConfig.app.PORT}`);
    console.log('--------------------------------------------------');
  });
}

/**
 * GLOBAL ERROR HANDLERS
 */
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Run app
startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
