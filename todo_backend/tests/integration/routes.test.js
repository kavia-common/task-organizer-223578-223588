'use strict';
const request = require('supertest');
const app = require('../../src/app');
const { getDb, closeMongo, connectMongo } = require('../../src/db/mongo');

describe('API routes integration', () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    const db = await getDb();
    await db.dropDatabase();
    await closeMongo();
  });

  it('should create and list a task', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .send({ title: 'Route test task', priority: 3, completed: false })
      .expect(201);
    expect(createRes.body._id).toBeDefined();

    const listRes = await request(app).get('/api/tasks').expect(200);
    expect(listRes.body.items.length).toBeGreaterThan(0);
  });

  it('should create and delete a category', async () => {
    const createRes = await request(app).post('/api/categories').send({ name: 'Home' }).expect(201);
    const id = createRes.body._id;
    await request(app).delete(`/api/categories/${id}`).expect(204);
  });
});
