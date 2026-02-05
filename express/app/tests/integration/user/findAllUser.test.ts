import request from 'supertest';
import app from '@/app';
import { database } from '@/providers/database.provider';

describe('User Integration - find all users', () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  it('returns list of users', async () => {
    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
