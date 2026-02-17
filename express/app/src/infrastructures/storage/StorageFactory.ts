import { IStorageService } from './IStorageService';
import { S3StorageService } from './S3StorageService';
import { MinioStorageService } from './MinioStorageService';
import { GarageStorageService } from './GarageStorageService';
import { IStorageConfig } from './IStorageConfig';

type TDatabase = 'aws' | 'minio' | 'garage';

export class StorageFactory {
  private static storage: Map<TDatabase, IStorageService> = new Map();

  static create(provider: TDatabase, config: IStorageConfig): IStorageService {
    if (this.storage.has(provider)) return this.storage.get(provider)!;

    switch (provider) {
      case 'aws':
        this.storage.set(provider, new S3StorageService(config));
        return this.storage.get(provider)!;
      case 'minio':
        this.storage.set(provider, new MinioStorageService(config));
        return this.storage.get(provider)!;
      case 'garage':
        this.storage.set(provider, new GarageStorageService(config));
        return this.storage.get(provider)!;
      default:
        throw new Error('Unknown storage provider');
    }
  }
}
