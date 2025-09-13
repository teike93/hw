import { config } from 'dotenv';
import { build } from './app.js';

config();

const server = build({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  },
});

async function start() {
  try {
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