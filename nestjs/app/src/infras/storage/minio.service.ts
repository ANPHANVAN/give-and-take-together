import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { StorageConfig } from './storage.config';
import { StorageService } from './storage.service';

@Injectable()
export class MinioStorageService extends StorageService implements OnModuleInit {
  private client: S3Client;
  private bucket: string;

  constructor(config: StorageConfig) {
    super();
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: 'us-east-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
      },
      maxAttempts: config.maxAttempts,
    });

    this.bucket = config.bucket;
  }

  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      console.log(`Bucket not found. Creating: ${this.bucket}`);

      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
    }
  }

  async healthCheck(): Promise<boolean> {
    await this.client.send(new ListBucketsCommand({}));
    return true;
  }

  async upload(key: string, data: Buffer, contentType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: contentType,
      }),
    );

    return key;
  }

  async getSignedUrl(key: string, expiresInSec = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.client, command, { expiresIn: expiresInSec });
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async onModuleInit() {
    try {
      const ok = await this.healthCheck();
      if (!ok) {
        throw new Error('Storage healthCheck failed');
      }

      await this.ensureBucket();
      console.log('Storage Connection Successful');
    } catch (error) {
      console.error('Storage Connection Failed');
      console.error(error);
    }
  }
}
