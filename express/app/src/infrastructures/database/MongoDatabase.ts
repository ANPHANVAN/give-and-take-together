import mongoose from 'mongoose';
import { IDatabase } from './IDatabase';

export class MongoDatabase implements IDatabase {
  constructor(private uriConnect: string) {}

  async connect(): Promise<boolean> {
    try {
      await mongoose.connect(this.uriConnect);
      console.log('Mongoose connected');
      return true;
    } catch (error) {
      console.error('Mongoose failed to connect:', error);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      await mongoose.disconnect();
      console.log('Mongoose disconnected');
      return true;
    } catch (error) {
      console.error('Mongoose failed to disconnect:', error);
      return false;
    }
  }
}
