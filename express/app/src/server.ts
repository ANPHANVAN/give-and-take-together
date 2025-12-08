import http from 'http';

import app from './app';
import envConfig from './config/envConfig';
import { initMinio } from './lib/s3Client';
import { initPrisma } from './lib/prisma';
import { storage } from '@/providers/storage.provider';
const server = http.createServer(app);

async function bootstrap() {
  await initPrisma();
  await initMinio();

  console.log('Checking storage health...');
  const ok = await storage.healthCheck();

  if (!ok) {
    console.error('Storage connection failed...');
    // process.exit(1);
  }
  console.log('Storage Health OK');

  console.log('Ensuring bucket exists...');
  await storage.ensureBucket();
  console.log('Bucket ready');
}

async function startServer() {
  console.log('Đang khởi động server..........');

  // await bootstrap();
  await initPrisma();
  await initMinio();
  server.listen(envConfig.app.PORT, () => {
    console.log(`Server running on ${envConfig.app.API_HOST} at port ${envConfig.app.PORT}`);
  });
}

// Bắt lỗi toàn cục nếu có gì crash
startServer().catch((err) => {
  console.error('Server khởi động thất bại:', err);
  process.exit(1);
});
