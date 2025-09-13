import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { prisma } from '../utils/db.js';
import {
  CreateTicketSchema,
  UpdateTicketSchema,
  TicketParamsSchema,
  PaginationQuerySchema,
  CreateTicketJsonSchema,
  UpdateTicketJsonSchema,
  TicketResponseJsonSchema,
} from '../schemas/ticket.js';

export default async function ticketsRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Get all tickets with filtering, sorting, and pagination
  fastify.get(
    '/',
    {
      schema: {
        description: 'Get all tickets with filtering, sorting, and pagination',
        tags: ['tickets'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            sortBy: {
              type: 'string',
              enum: ['createdAt', 'updatedAt', 'title', 'status', 'priority'],
              default: 'createdAt',
            },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            status: {
              type: 'string',
              enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            },
            search: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              tickets: {
                type: 'array',
                items: TicketResponseJsonSchema,
              },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'integer' },
                  limit: { type: 'integer' },
                  total: { type: 'integer' },
                  pages: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const query = PaginationQuerySchema.parse(request.query);

      const where: any = {};

      // Apply filters
      if (query.status) where.status = query.status;
      if (query.priority) where.priority = query.priority;
      if (query.search) {
        where.OR = [
          { title: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { user: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      const offset = (query.page - 1) * query.limit;

      const [tickets, total] = await Promise.all([
        prisma.ticket.findMany({
          where,
          orderBy: { [query.sortBy]: query.sortOrder },
          skip: offset,
          take: query.limit,
          include: {
            comments: {
              orderBy: { createdAt: 'desc' },
              take: 3, // Only include latest 3 comments in list view
            },
          },
        }),
        prisma.ticket.count({ where }),
      ]);

      const pages = Math.ceil(total / query.limit);

      return {
        tickets,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          pages,
        },
      };
    }
  );

  // Get specific ticket by ID
  fastify.get(
    '/:id',
    {
      schema: {
        description: 'Get a specific ticket by ID',
        tags: ['tickets'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          200: TicketResponseJsonSchema,
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

      const ticket = await prisma.ticket.findUnique({
        where: { id },
        include: {
          comments: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!ticket) {
        return reply.notFound('Ticket not found');
      }

      return ticket;
    }
  );

  // Create new ticket
  fastify.post(
    '/',
    {
      schema: {
        description: 'Create a new ticket',
        tags: ['tickets'],
        body: CreateTicketJsonSchema,
        response: {
          201: TicketResponseJsonSchema,
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const ticketData = CreateTicketSchema.parse(request.body);

      const ticket = await prisma.ticket.create({
        data: ticketData,
        include: {
          comments: true,
        },
      });

      reply.code(201);
      return ticket;
    }
  );

  // Update ticket
  fastify.put(
    '/:id',
    {
      schema: {
        description: 'Update a specific ticket',
        tags: ['tickets'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        body: UpdateTicketJsonSchema,
        response: {
          200: TicketResponseJsonSchema,
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
      const updateData = UpdateTicketSchema.parse(request.body);

      try {
        const ticket = await prisma.ticket.update({
          where: { id },
          data: updateData,
          include: {
            comments: {
              orderBy: { createdAt: 'asc' },
            },
          },
        });

        return ticket;
      } catch (error: any) {
        if (error.code === 'P2025') {
          return reply.notFound('Ticket not found');
        }
        throw error;
      }
    }
  );

  // Delete ticket
  fastify.delete(
    '/:id',
    {
      schema: {
        description: 'Delete a specific ticket',
        tags: ['tickets'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
          required: ['id'],
        },
        response: {
          204: { type: 'null' },
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

      try {
        await prisma.ticket.delete({
          where: { id },
        });

        reply.code(204);
        return;
      } catch (error: any) {
        if (error.code === 'P2025') {
          return reply.notFound('Ticket not found');
        }
        throw error;
      }
    }
  );
}