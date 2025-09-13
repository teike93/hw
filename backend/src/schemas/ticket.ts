import { z } from 'zod';
import { Status, Priority } from '../types/index.js';

export const StatusSchema = z.enum([
  Status.OPEN,
  Status.IN_PROGRESS,
  Status.RESOLVED,
  Status.CLOSED,
]);

export const PrioritySchema = z.enum([
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
  Priority.CRITICAL,
]);

export const CreateTicketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  user: z.string().min(1).max(100),
  priority: PrioritySchema.optional(),
});

export const UpdateTicketSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  user: z.string().min(1).max(100).optional(),
  status: StatusSchema.optional(),
  priority: PrioritySchema.optional(),
});

export const TicketParamsSchema = z.object({
  id: z.string().uuid(),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'title', 'status', 'priority'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: StatusSchema.optional(),
  priority: PrioritySchema.optional(),
  search: z.string().optional(),
});

// Fastify JSON Schema equivalents for OpenAPI documentation
export const CreateTicketJsonSchema = {
  type: 'object',
  required: ['title', 'description', 'user'],
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
    user: { type: 'string', minLength: 1, maxLength: 100 },
    priority: {
      type: 'string',
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
  },
} as const;

export const UpdateTicketJsonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
    user: { type: 'string', minLength: 1, maxLength: 100 },
    status: {
      type: 'string',
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    },
    priority: {
      type: 'string',
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
  },
} as const;

export const TicketResponseJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    ticketNumber: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    user: { type: 'string' },
    status: {
      type: 'string',
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    },
    priority: {
      type: 'string',
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    comments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          content: { type: 'string' },
          author: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
} as const;