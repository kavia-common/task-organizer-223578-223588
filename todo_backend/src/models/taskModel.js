'use strict';
const { getDb } = require('../db/mongo');

/**
 * Accessor for the tasks collection with helper to map ObjectId if needed.
 */

// PUBLIC_INTERFACE
async function getTasksCollection() {
  /** Returns the MongoDB collection for tasks. */
  const db = await getDb();
  return db.collection('tasks');
}

module.exports = { getTasksCollection };
