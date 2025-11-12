'use strict';
const { MongoClient } = require('mongodb');
const { getConfig } = require('../config/env');

let cachedClient = null;
let cachedDb = null;

/**
 * Connect to MongoDB and cache the connection.
 * Ensures indexes are created on first connect.
 */
async function connectMongo() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const config = getConfig();
  const client = new MongoClient(config.mongoUrl, {
    maxPoolSize: 20,
    minPoolSize: 0,
    retryWrites: true,
    w: 'majority',
  });
  await client.connect();
  const db = client.db(config.mongoDb);

  // Ensure indexes for collections
  await ensureIndexes(db);

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

async function ensureIndexes(db) {
  // Tasks indexes
  const tasks = db.collection('tasks');
  await tasks.createIndex({ title: 'text', description: 'text' }, { name: 'tasks_text_idx' });
  await tasks.createIndex({ categoryId: 1 }, { name: 'tasks_category_idx' });
  await tasks.createIndex({ dueDate: 1 }, { name: 'tasks_due_idx' });
  await tasks.createIndex({ priority: 1 }, { name: 'tasks_priority_idx' });
  await tasks.createIndex({ completed: 1 }, { name: 'tasks_completed_idx' });

  // Categories: unique name with case-insensitive collation
  const categories = db.collection('categories');
  // Ensure collection with collation exists
  await categories.createIndex(
    { name: 1 },
    {
      name: 'categories_unique_name_ci',
      unique: true,
      collation: { locale: 'en', strength: 2 }, // case-insensitive
    }
  );
}

// PUBLIC_INTERFACE
async function getDb() {
  /** Returns a connected MongoDB database instance. */
  const { db } = await connectMongo();
  return db;
}

// PUBLIC_INTERFACE
async function closeMongo() {
  /** Closes the MongoDB client if connected (for tests/shutdown). */
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

module.exports = { getDb, closeMongo, connectMongo };
