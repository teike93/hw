import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './utils/errors.js';

export function build(opts = {}) {
  const app: FastifyInstance = Fastify(opts);

  // Register plugins
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
      },
    },
  });

  app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  app.register(sensible);

  // Register error handler
  app.setErrorHandler(errorHandler);

  // Register Swagger
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Helpdesk Ticketing API',
        description: 'API for managing helpdesk tickets and comments',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Development server',
        },
      ],
    },
  });

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Health check route
  app.get('/health', async () => {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  });

  // API routes
  app.register(
    async function (fastify) {
      fastify.get('/', async () => {
        return { message: 'Helpdesk Ticketing System API' };
      });

      // Register tickets routes
      await fastify.register(
        (await import('./routes/tickets.js')).default,
        { prefix: '/tickets' }
      );

      // Register comments routes (nested under tickets)
      await fastify.register(
        (await import('./routes/comments.js')).default,
        { prefix: '/tickets' }
      );
    },
    { prefix: '/api' }
  );

  return app;
}