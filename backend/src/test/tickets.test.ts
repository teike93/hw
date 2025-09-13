import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify from 'fastify';
import { build } from '../app.js';

describe('Tickets API', () => {
  let app: any;

  beforeAll(async () => {
    app = build({ logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/tickets', () => {
    it('should return tickets list with pagination', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tickets',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('tickets');
      expect(body).toHaveProperty('pagination');
      expect(Array.isArray(body.tickets)).toBe(true);
    });

    it('should accept pagination parameters', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tickets?page=1&limit=5',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.pagination.page).toBe(1);
      expect(body.pagination.limit).toBe(5);
    });

    it('should accept filter parameters', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tickets?status=OPEN&priority=HIGH',
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /api/tickets', () => {
    it('should create a new ticket', async () => {
      const ticketData = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        user: 'testuser@example.com',
        priority: 'MEDIUM',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/api/tickets',
        payload: ticketData,
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.title).toBe(ticketData.title);
      expect(body.description).toBe(ticketData.description);
      expect(body.user).toBe(ticketData.user);
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('ticketNumber');
    });

    it('should validate required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/tickets',
        payload: {
          title: 'Test',
          // missing description and user
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/tickets/:id', () => {
    it('should return 404 for non-existent ticket', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tickets/00000000-0000-0000-0000-000000000000',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});