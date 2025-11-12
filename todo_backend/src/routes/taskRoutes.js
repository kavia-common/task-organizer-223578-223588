'use strict';
const express = require('express');
const controller = require('../controllers/taskController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Task management
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: List tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: completed
 *         schema: { type: boolean }
 *       - in: query
 *         name: priority
 *         schema: { type: integer, minimum: 1, maximum: 5 }
 *       - in: query
 *         name: dueFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: dueTo
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [dueDate, priority, createdAt, updatedAt, title] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100 }
 *     responses:
 *       200:
 *         description: List of tasks with pagination
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               categoryId: { type: string, nullable: true }
 *               dueDate: { type: string, format: date-time, nullable: true }
 *               priority: { type: integer, minimum: 1, maximum: 5 }
 *               completed: { type: boolean }
 *     responses:
 *       201:
 *         description: Created task
 */
router.post('/', controller.create.bind(controller));

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.get.bind(controller));

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
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
 *       200: { description: Updated task }
 *       404: { description: Not found }
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Patch task
 *     tags: [Tasks]
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
 *       200: { description: Updated task }
 *       404: { description: Not found }
 */
router.patch('/:id', controller.patch.bind(controller));

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
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
