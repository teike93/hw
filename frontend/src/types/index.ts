// Enums matching backend
export enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Main entities
export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  user: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  ticketId: string;
  createdAt: string;
}

// Request types
export interface CreateTicketRequest {
  title: string;
  description: string;
  user: string;
  priority?: Priority;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  user?: string;
  status?: Status;
  priority?: Priority;
}

export interface CreateCommentRequest {
  content: string;
  author: string;
}

// API response types
export interface TicketListResponse {
  tickets: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Query parameters
export interface TicketFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'status' | 'priority';
  sortOrder?: 'asc' | 'desc';
  status?: Status;
  priority?: Priority;
  search?: string;
}