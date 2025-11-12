'use strict';
const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  color: Joi.string().pattern(/^#([0-9a-fA-F]{3}){1,2}$/).allow(null),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100),
  color: Joi.string().pattern(/^#([0-9a-fA-F]{3}){1,2}$/).allow(null),
}).min(1);

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
