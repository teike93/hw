import Fastify from 'fastify';
import { config } from 'dotenv';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './utils/errors.js';

config();

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  },
});

async function start() {
  try {
    // Register plugins
    await server.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
        },
      },
    });

    await server.register(cors, {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    });

    await server.register(sensible);

    // Register error handler
    server.setErrorHandler(errorHandler);

    // Register Swagger
    await server.register(swagger, {
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

    await server.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    });

    // Health check route
    server.get('/health', async () => {
      return { status: 'healthy', timestamp: new Date().toISOString() };
    });

    // API routes
    server.register(
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

    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
    console.log(`📚 API Documentation: http://${host}:${port}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully');
  await server.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully');
  await server.close();
  process.exit(0);
});

start();