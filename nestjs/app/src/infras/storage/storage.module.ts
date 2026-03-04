import { Global, Module } from '@nestjs/common';
import { MinioStorageService } from './minio.service';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { S3StorageService } from './s3.service';
import { GarageStorageService } from './garage.service';
import { StorageConfig } from './storage.config';

@Global()
@Module({
  imports: [],
  exports: [StorageService],
  providers: [
    StorageConfig,
    MinioStorageService,
    S3StorageService,
    GarageStorageService,
    {
      provide: StorageService,
      useFactory: (
        config: ConfigService,
        minio: MinioStorageService,
        s3: S3StorageService,
        garage: GarageStorageService,
      ) => {
        const driver = config.getOrThrow<string>('minio.minioStorageDriver');
        switch (driver) {
          case 'minio':
            return minio;
          case 's3':
            return s3;
          case 'garage':
            return garage;
          default:
            throw new Error('Unknown storage provider');
        }
      },
      inject: [ConfigService],
    },
  ],
})
export class StorageModule {}
