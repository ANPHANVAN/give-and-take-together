import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import { StorageService } from './storage.service';
import { StorageConfig } from './storage.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3StorageService extends StorageService {
  private client: S3Client;
  private bucket: string;

  constructor(config: StorageConfig) {
    super();
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: config.forcePathStyle,
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

  async getSignedUrl(key: string): Promise<string> {
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async delete(key: string): Promise<void> {
    // implement delete
  }
}
