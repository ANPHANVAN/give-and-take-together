import { minioConfig } from '@/config/envConfig';
import { StorageFactory } from '@/infrastructures/storage/StorageFactory';

export const storage = StorageFactory.create('minio', {
  endpoint: minioConfig.ENDPOINT,
  region: minioConfig.MINIO_REGION,
  forcePathStyle: true, // QUAN TRỌNG NHẤT với MinIO
  credentials: {
    accessKeyId: minioConfig.ACCESS_KEY,
    secretAccessKey: minioConfig.SECRET_KEY,
  },
  maxAttempts: 3, // retry 3 lần
  bucket: minioConfig.BUCKET_NAME,
});
