import { minioConfig } from '@/config/envConfig';
import { StorageFactory } from '@/infrastructures/storage/StorageFactory';

export const storage = StorageFactory.create('minio', {
  region: minioConfig.MINIO_REGION,
  endpoint: `${minioConfig.ENDPOINT}`,
  credentials: {
    accessKeyId: minioConfig.ACCESS_KEY,
    secretAccessKey: minioConfig.SECRET_KEY,
  },
  forcePathStyle: true, // QUAN TRỌNG NHẤT với MinIO
  maxAttempts: 3, // retry 3 lần
});
