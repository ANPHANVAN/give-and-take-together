import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  ListBucketsCommand,
} from '@aws-sdk/client-s3';
import { IStorageService } from './IStorageService';

export class GarageStorageService implements IStorageService {
  private client: S3Client;
  private bucket: string;

  constructor(config: { endpoint: string; accessKeyId: string; secretAccessKey: string; bucket: string }) {
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: 'garage',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
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
    try {
      await this.client.send(new ListBucketsCommand({}));
      return true;
    } catch (e) {
      return false;
    }
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
    return `${this.client.config.endpoint}/${this.bucket}/${key}`;
  }

  async delete(key: string): Promise<void> {}
}
