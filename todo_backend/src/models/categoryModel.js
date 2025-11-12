'use strict';
const { getDb } = require('../db/mongo');

/**
 * Accessor for the categories collection.
 */

// PUBLIC_INTERFACE
async function getCategoriesCollection() {
  /** Returns the MongoDB collection for categories. */
  const db = await getDb();
  return db.collection('categories');
}

module.exports = { getCategoriesCollection };
