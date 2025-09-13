import { apiClient } from './api';
import type { 
  Ticket, 
  TicketListResponse, 
  CreateTicketRequest, 
  UpdateTicketRequest,
  TicketFilters 
} from '../types';

const BASE_PATH = '/tickets';

export class TicketsAPI {
  // Get all tickets with optional filtering
  static async getTickets(filters?: TicketFilters): Promise<TicketListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${BASE_PATH}?${params.toString()}`;
    const response = await apiClient.get<TicketListResponse>(url);
    return response.data;
  }

  // Get a specific ticket by ID
  static async getTicket(id: string): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`${BASE_PATH}/${id}`);
    return response.data;
  }

  // Create a new ticket
  static async createTicket(ticket: CreateTicketRequest): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(BASE_PATH, ticket);
    return response.data;
  }

  // Update an existing ticket
  static async updateTicket(id: string, updates: UpdateTicketRequest): Promise<Ticket> {
    const response = await apiClient.put<Ticket>(`${BASE_PATH}/${id}`, updates);
    return response.data;
  }

  // Delete a ticket
  static async deleteTicket(id: string): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${id}`);
  }
}

// Export individual functions for easier use with React Query
export const ticketsAPI = {
  getTickets: TicketsAPI.getTickets,
  getTicket: TicketsAPI.getTicket,
  createTicket: TicketsAPI.createTicket,
  updateTicket: TicketsAPI.updateTicket,
  deleteTicket: TicketsAPI.deleteTicket,
};