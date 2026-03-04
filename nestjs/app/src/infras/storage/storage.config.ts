import { Injectable } from '@nestjs/common';
import { IStorageConfig } from './IStorageConfig';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfig implements IStorageConfig {
  region: string;
  forcePathStyle: boolean;
  endpoint: string;
  bucket: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  maxAttempts: number;

  constructor(private configService: ConfigService) {
    this.region = this.configService.getOrThrow('minio.minioRegion');
    this.forcePathStyle = true;
    this.endpoint = this.configService.getOrThrow('minio.minioEndpoint');
    this.bucket = this.configService.getOrThrow('minio.minioBucket');
    this.credentials = {
      accessKeyId: this.configService.getOrThrow('minio.minioRootUser'),
      secretAccessKey: this.configService.getOrThrow('minio.minioRootPassword'),
    };
    this.maxAttempts = this.configService.getOrThrow('minio.minioMaxAttempts');
  }
}
