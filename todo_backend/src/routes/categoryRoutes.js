'use strict';
const express = require('express');
const controller = require('../controllers/categoryController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: List categories with pagination
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               color: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Created category
 *       409:
 *         description: Name conflict
 */
router.post('/', controller.create.bind(controller));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.get.bind(controller));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Updated category }
 *       404: { description: Not found }
 *       409: { description: Name conflict }
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Not found }
 */
router.delete('/:id', controller.remove.bind(controller));

module.exports = router;
