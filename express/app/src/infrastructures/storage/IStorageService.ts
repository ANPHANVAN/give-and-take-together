export interface IStorageService {
  healthCheck(): Promise<boolean>;
  ensureBucket(): Promise<void>;
  upload(key: string, data: Buffer, contentType: string): Promise<string>;
  getSignedUrl(key: string, expiresInSec?: number): Promise<string>;
  delete(key: string): Promise<void>;
}
