import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Custom application errors
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      error: error.message,
    });
  }

  // Prisma errors
  if (error.code?.startsWith('P')) {
    switch (error.code) {
      case 'P2002':
        return reply.code(409).send({
          error: 'Conflict',
          message: 'A record with this data already exists',
        });
      case 'P2025':
        return reply.code(404).send({
          error: 'Not Found',
          message: 'The requested resource was not found',
        });
      case 'P2003':
        return reply.code(400).send({
          error: 'Bad Request',
          message: 'Foreign key constraint failed',
        });
      default:
        request.log.error(`Unhandled Prisma error: ${error.code}`);
        return reply.code(500).send({
          error: 'Database Error',
          message: 'An error occurred while processing your request',
        });
    }
  }

  // Fastify validation errors
  if (error.validation) {
    return reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    });
  }

  // Default server error
  const statusCode = error.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : error.message;

  return reply.code(statusCode).send({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};