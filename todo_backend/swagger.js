const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do API',
      version: '1.0.0',
      description: 'Task and Category management API for To-Do application',
    },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Tasks', description: 'Task management' },
      { name: 'Categories', description: 'Category management' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
