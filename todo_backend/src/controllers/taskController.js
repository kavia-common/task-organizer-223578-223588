'use strict';
const taskService = require('../services/taskService');
const { createTaskSchema, updateTaskSchema, listQuerySchema } = require('../validation/taskSchemas');

/**
 * Controller for task routes.
 */
class TaskController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Creates a task. */
    try {
      const { value, error } = createTaskSchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ error: error.message });
      const created = await taskService.createTask(value);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** Lists tasks with filters/pagination. */
    try {
      const parseBoolean = (v) => (v === 'true' ? true : v === 'false' ? false : undefined);
      const queryInput = {
        ...req.query,
        completed: req.query.completed !== undefined ? parseBoolean(req.query.completed) : undefined,
        priority: req.query.priority !== undefined ? Number(req.query.priority) : undefined,
        page: req.query.page !== undefined ? Number(req.query.page) : undefined,
        limit: req.query.limit !== undefined ? Number(req.query.limit) : undefined,
      };
      const { value, error } = listQuerySchema.validate(queryInput, { abortEarly: false });
      if (error) return res.status(400).json({ error: error.message });
      const result = await taskService.listTasks(value);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Gets a single task by id. */
    try {
      const task = await taskService.getTaskById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Updates task (PUT full or PATCH partial supported via schema). */
    try {
      const { value, error } = updateTaskSchema.validate(req.body, { abortEarly: false });
      if (error) return res.status(400).json({ error: error.message });
      const updated = await taskService.updateTask(req.params.id, value);
      if (!updated) return res.status(404).json({ error: 'Task not found' });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  // PUBLIC_INTERFACE
  async patch(req, res, next) {
    /** Alias to update for PATCH. */
    return this.update(req, res, next);
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Deletes a task by id. */
    try {
      const ok = await taskService.deleteTask(req.params.id);
      if (!ok) return res.status(404).json({ error: 'Task not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TaskController();
