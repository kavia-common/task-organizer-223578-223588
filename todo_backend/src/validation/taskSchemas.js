'use strict';
const Joi = require('joi');

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const baseTaskSchema = {
  title: Joi.string().min(1).max(200),
  description: Joi.string().allow('').max(5000),
  categoryId: Joi.string().pattern(objectIdPattern).allow(null),
  dueDate: Joi.date().iso().allow(null),
  priority: Joi.number().integer().min(1).max(5).default(3),
  completed: Joi.boolean().default(false),
};

const createTaskSchema = Joi.object({
  title: baseTaskSchema.title.required(),
  description: baseTaskSchema.description.default(''),
  categoryId: baseTaskSchema.categoryId.default(null),
  dueDate: baseTaskSchema.dueDate.default(null),
  priority: baseTaskSchema.priority,
  completed: baseTaskSchema.completed,
});

const updateTaskSchema = Joi.object({
  title: baseTaskSchema.title,
  description: baseTaskSchema.description,
  categoryId: baseTaskSchema.categoryId,
  dueDate: baseTaskSchema.dueDate,
  priority: baseTaskSchema.priority,
  completed: baseTaskSchema.completed,
}).min(1);

const listQuerySchema = Joi.object({
  search: Joi.string().min(1),
  categoryId: Joi.string().pattern(objectIdPattern),
  completed: Joi.boolean(),
  priority: Joi.number().integer().min(1).max(5),
  dueFrom: Joi.date().iso(),
  dueTo: Joi.date().iso(),
  sort: Joi.string().valid('dueDate', 'priority', 'createdAt', 'updatedAt', 'title'),
  order: Joi.string().valid('asc', 'desc').default('asc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  listQuerySchema,
};
