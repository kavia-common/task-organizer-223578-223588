'use strict';
const { ObjectId } = require('mongodb');
const { getCategoriesCollection } = require('../models/categoryModel');
const { getPagination, buildPageMeta } = require('../utils/pagination');

// PUBLIC_INTERFACE
async function createCategory(data) {
  /** Creates a category with unique case-insensitive name. */
  const col = await getCategoriesCollection();
  const now = new Date();
  const doc = {
    name: data.name,
    color: data.color ?? null,
    createdAt: now,
    updatedAt: now,
  };
  const res = await col.insertOne(doc);
  return { ...doc, _id: res.insertedId };
}

// PUBLIC_INTERFACE
async function listCategories(query = {}) {
  /** Lists categories with pagination and optional name search. */
  const col = await getCategoriesCollection();
  const filter = {};
  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }
  const sort = { name: 1 };
  const { skip, limit, page } = getPagination(query.page, query.limit);
  const cursor = col.find(filter).sort(sort).skip(skip).limit(limit);
  const [items, total] = await Promise.all([cursor.toArray(), col.countDocuments(filter)]);
  const meta = buildPageMeta(total, page, limit);
  return { items, meta };
}

// PUBLIC_INTERFACE
async function getCategoryById(id) {
  /** Returns category by id or null. */
  const col = await getCategoriesCollection();
  return col.findOne({ _id: new ObjectId(id) });
}

// PUBLIC_INTERFACE
async function updateCategory(id, data) {
  /** Updates category and returns updated doc. */
  const col = await getCategoriesCollection();
  const update = { $set: { updatedAt: new Date() } };
  if (data.name !== undefined) update.$set.name = data.name;
  if (data.color !== undefined) update.$set.color = data.color ?? null;
  await col.updateOne({ _id: new ObjectId(id) }, update);
  return getCategoryById(id);
}

// PUBLIC_INTERFACE
async function deleteCategory(id) {
  /** Deletes category by id and returns boolean of deletion. */
  const col = await getCategoriesCollection();
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
