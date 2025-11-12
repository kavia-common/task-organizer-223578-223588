'use strict';
const categoryService = require('../services/categoryService');
const { createCategorySchema, updateCategorySchema } = require('../validation/categorySchemas');

class CategoryController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Creates a category. */
    try {
      const { value, error } = createCategorySchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ error: error.message });
      const created = await categoryService.createCategory(value);
      res.status(201).json(created);
    } catch (err) {
      // Handle duplicate key (unique name)
      if (err && err.code === 11000) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** Lists categories with pagination. */
    try {
      const result = await categoryService.listCategories({
        search: req.query.search,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Returns a category by id. */
    try {
      const cat = await categoryService.getCategoryById(req.params.id);
      if (!cat) return res.status(404).json({ error: 'Category not found' });
      res.json(cat);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Updates a category by id. */
    try {
      const { value, error } = updateCategorySchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ error: error.message });
      const updated = await categoryService.updateCategory(req.params.id, value);
      if (!updated) return res.status(404).json({ error: 'Category not found' });
      res.json(updated);
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Deletes a category by id. */
    try {
      const ok = await categoryService.deleteCategory(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Category not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CategoryController();
