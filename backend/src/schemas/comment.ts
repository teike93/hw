import { z } from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  author: z.string().min(1).max(100),
});

export const CommentParamsSchema = z.object({
  id: z.string().uuid(),
});

// Fastify JSON Schema equivalents for OpenAPI documentation
export const CreateCommentJsonSchema = {
  type: 'object',
  required: ['content', 'author'],
  properties: {
    content: { type: 'string', minLength: 1, maxLength: 1000 },
    author: { type: 'string', minLength: 1, maxLength: 100 },
  },
} as const;

export const CommentResponseJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    author: { type: 'string' },
    ticketId: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
  },
} as const;