import {
  S3Client,
  CreateBucketCommand,
  ListBucketsCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IStorageService } from './IStorageService';
import { IStorageConfig } from './IStorageConfig';

export class MinioStorageService implements IStorageService {
  private client: S3Client;
  private bucket: string;

  constructor(config: IStorageConfig) {
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: 'us-east-1',
      forcePathStyle: true, // QUAN TRỌNG CHO MINIO
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
    try {
      await this.client.send(new ListBucketsCommand({}));
      return true;
    } catch (e) {
      throw e;
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
}
