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

export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  user: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  ticketId: string;
  createdAt: Date;
}

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

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'status' | 'priority';
  sortOrder?: 'asc' | 'desc';
  status?: Status;
  priority?: Priority;
  search?: string;
}