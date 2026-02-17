export interface IStorageConfig {
  region: string;
  forcePathStyle: boolean;
  endpoint: string;
  bucket: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  maxAttempts: number;
}
