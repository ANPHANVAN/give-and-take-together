export abstract class StorageService {
  abstract healthCheck(): Promise<boolean>;
  abstract ensureBucket(): Promise<void>;
  abstract upload(key: string, data: Buffer, contentType: string): Promise<string>;
  abstract getSignedUrl(key: string, expiresInSec?: number): Promise<string>;
  abstract delete(key: string): Promise<void>;
}
