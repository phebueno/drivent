import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb } from '../helpers';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('/GET hotels', () => {
  it('should dar error', async () => {
    const response = await server.get('/hotels');
    expect(response.statusCode).toBe(401);
  });
});
