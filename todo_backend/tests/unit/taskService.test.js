'use strict';

const { getDb, closeMongo, connectMongo } = require('../../src/db/mongo');
const taskService = require('../../src/services/taskService');

describe('taskService', () => {
  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(async () => {
    const db = await getDb();
    await db.dropDatabase();
    await closeMongo();
  });

  test('create/list/update/delete task flow', async () => {
    const created = await taskService.createTask({
      title: 'Test task',
      description: 'Do something',
      completed: false,
      priority: 2,
    });
    expect(created._id).toBeDefined();

    let listed = await taskService.listTasks({ page: 1, limit: 10 });
    expect(listed.items.length).toBe(1);

    const updated = await taskService.updateTask(created._id.toString(), { completed: true });
    expect(updated.completed).toBe(true);

    const removed = await taskService.deleteTask(created._id.toString());
    expect(removed).toBe(true);

    listed = await taskService.listTasks({ page: 1, limit: 10 });
    expect(listed.items.length).toBe(0);
  });

  test('search and filter works', async () => {
    await taskService.createTask({ title: 'Buy milk', description: '2% milk', priority: 3 });
    await taskService.createTask({ title: 'Buy bread', description: 'Whole grain', priority: 4, completed: true });
    await taskService.createTask({ title: 'Workout', description: 'Gym', priority: 2 });

    const byText = await taskService.listTasks({ search: 'Buy', page: 1, limit: 10 });
    expect(byText.items.length).toBeGreaterThanOrEqual(2);

    const completed = await taskService.listTasks({ completed: true, page: 1, limit: 10 });
    expect(completed.items.every(t => t.completed === true)).toBe(true);

    const highPriority = await taskService.listTasks({ priority: 4, page: 1, limit: 10 });
    expect(highPriority.items.every(t => t.priority === 4)).toBe(true);
  });
});
