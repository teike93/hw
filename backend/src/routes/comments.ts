import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../utils/db.js';
import {
  CreateCommentSchema,
  CreateCommentJsonSchema,
  CommentResponseJsonSchema,
} from '../schemas/comment.js';
import { TicketParamsSchema } from '../schemas/ticket.js';

export default async function commentsRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Get all comments for a ticket
  fastify.get(
    '/:id/comments',
    {
      schema: {
        description: 'Get all comments for a specific ticket',
        tags: ['comments'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'array',
            items: CommentResponseJsonSchema,
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = TicketParamsSchema.parse(request.params);

      // First check if ticket exists
      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        return reply.notFound('Ticket not found');
      }

      const comments = await prisma.comment.findMany({
        where: { ticketId: id },
        orderBy: { createdAt: 'asc' },
      });

      return comments;
    }
  );

  // Add comment to ticket
  fastify.post(
    '/:id/comments',
    {
      schema: {
        description: 'Add a comment to a specific ticket',
        tags: ['comments'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        body: CreateCommentJsonSchema,
        response: {
          201: CommentResponseJsonSchema,
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = TicketParamsSchema.parse(request.params);
      const commentData = CreateCommentSchema.parse(request.body);

      // First check if ticket exists
      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        return reply.notFound('Ticket not found');
      }

      const comment = await prisma.comment.create({
        data: {
          ...commentData,
          ticketId: id,
        },
      });

      reply.code(201);
      return comment;
    }
  );
}