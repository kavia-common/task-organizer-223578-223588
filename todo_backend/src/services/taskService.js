'use strict';
const { ObjectId } = require('mongodb');
const { getTasksCollection } = require('../models/taskModel');
const { getPagination, buildPageMeta } = require('../utils/pagination');

/**
 * Service layer for tasks.
 */

// PUBLIC_INTERFACE
async function createTask(data) {
  /** Creates a new task, sets timestamps. */
  const col = await getTasksCollection();
  const now = new Date();
  const doc = {
    title: data.title,
    description: data.description || '',
    categoryId: data.categoryId ? new ObjectId(data.categoryId) : null,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    priority: data.priority ?? 3,
    completed: data.completed ?? false,
    createdAt: now,
    updatedAt: now,
  };
  const res = await col.insertOne(doc);
  return { ...doc, _id: res.insertedId };
}

// PUBLIC_INTERFACE
async function getTaskById(id) {
  /** Returns task by id or null. */
  const col = await getTasksCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

// PUBLIC_INTERFACE
async function updateTask(id, data) {
  /** Updates task fields and returns updated document. */
  const col = await getTasksCollection();
  const update = { $set: { updatedAt: new Date() } };
  if (data.title !== undefined) update.$set.title = data.title;
  if (data.description !== undefined) update.$set.description = data.description;
  if (data.categoryId !== undefined) {
    update.$set.categoryId = data.categoryId ? new ObjectId(data.categoryId) : null;
  }
  if (data.dueDate !== undefined) {
    update.$set.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.priority !== undefined) update.$set.priority = data.priority;
  if (data.completed !== undefined) update.$set.completed = data.completed;

  await col.updateOne({ _id: new ObjectId(id) }, update);
  return getTaskById(id);
}

// PUBLIC_INTERFACE
async function deleteTask(id) {
  /** Deletes a task and returns deletion result boolean. */
  const col = await getTasksCollection();
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

// PUBLIC_INTERFACE
async function listTasks(query) {
  /** Lists tasks with search, filters, sort, pagination. */
  const col = await getTasksCollection();
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.categoryId) {
    filter.categoryId = new ObjectId(query.categoryId);
  }
  if (query.completed !== undefined) {
    filter.completed = query.completed;
  }
  if (query.priority !== undefined) {
    filter.priority = query.priority;
  }
  if (query.dueFrom || query.dueTo) {
    filter.dueDate = {};
    if (query.dueFrom) filter.dueDate.$gte = new Date(query.dueFrom);
    if (query.dueTo) filter.dueDate.$lte = new Date(query.dueTo);
  }

  const sort = {};
  if (query.sort) {
    const dir = (query.order || 'asc').toLowerCase() === 'desc' ? -1 : 1;
    sort[query.sort] = dir;
  } else {
    sort.createdAt = -1;
  }

  const { skip, limit, page } = getPagination(query.page, query.limit);
  const cursor = col.find(filter).sort(sort).skip(skip).limit(limit);
  const [items, total] = await Promise.all([cursor.toArray(), col.countDocuments(filter)]);
  const meta = buildPageMeta(total, page, limit);
  return { items, meta };
}

module.exports = {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  listTasks,
};
