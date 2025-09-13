import { apiClient } from './api';
import type { 
  Ticket, 
  TicketListResponse, 
  CreateTicketRequest, 
  UpdateTicketRequest,
  TicketFilters 
} from '../types';

export class TicketsAPI {
  private static readonly BASE_PATH = '/tickets';

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

    const response = await apiClient.get<TicketListResponse>(
      `${this.BASE_PATH}?${params.toString()}`
    );
    return response.data;
  }

  // Get a specific ticket by ID
  static async getTicket(id: string): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  // Create a new ticket
  static async createTicket(ticket: CreateTicketRequest): Promise<Ticket> {
    const response = await apiClient.post<Ticket>(this.BASE_PATH, ticket);
    return response.data;
  }

  // Update an existing ticket
  static async updateTicket(id: string, updates: UpdateTicketRequest): Promise<Ticket> {
    const response = await apiClient.put<Ticket>(`${this.BASE_PATH}/${id}`, updates);
    return response.data;
  }

  // Delete a ticket
  static async deleteTicket(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`);
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