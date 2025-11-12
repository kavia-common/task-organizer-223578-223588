'use strict';

const { getDb, closeMongo, connectMongo } = require('../../src/db/mongo');
const categoryService = require('../../src/services/categoryService');

describe('categoryService', () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    const db = await getDb();
    await db.dropDatabase();
    await closeMongo();
  });

  test('create/list/update/delete category flow', async () => {
    const cat = await categoryService.createCategory({ name: 'Work', color: '#ff0000' });
    expect(cat._id).toBeDefined();

    const list = await categoryService.listCategories({ page: 1, limit: 10 });
    expect(list.items.length).toBeGreaterThanOrEqual(1);

    const updated = await categoryService.updateCategory(cat._id.toString(), { name: 'Work Updated' });
    expect(updated.name).toBe('Work Updated');

    const removed = await categoryService.deleteCategory(cat._id.toString());
    expect(removed).toBe(true);
  });
});
