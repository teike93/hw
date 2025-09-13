import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsAPI } from '../services/tickets';
import type { 
  TicketFilters, 
  CreateTicketRequest, 
  UpdateTicketRequest,
  TicketListResponse,
  Ticket 
} from '../types';

// Query keys for React Query cache management
export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters?: TicketFilters) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
};

// Hook for fetching tickets list with filters
export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => ticketsAPI.getTickets(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
}

// Hook for fetching a single ticket
export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsAPI.getTicket(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for creating tickets
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticket: CreateTicketRequest) => ticketsAPI.createTicket(ticket),
    onSuccess: (newTicket) => {
      // Invalidate tickets lists to refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      
      // Optionally add the new ticket to the cache
      queryClient.setQueryData(ticketKeys.detail(newTicket.id), newTicket);
    },
    onError: (error) => {
      console.error('Failed to create ticket:', error);
    },
  });
}

// Hook for updating tickets
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTicketRequest }) =>
      ticketsAPI.updateTicket(id, updates),
    onSuccess: (updatedTicket, { id }) => {
      // Update the ticket in the cache
      queryClient.setQueryData(ticketKeys.detail(id), updatedTicket);
      
      // Invalidate tickets lists to refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update ticket:', error);
    },
  });
}

// Hook for deleting tickets
export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ticketsAPI.deleteTicket(id),
    onSuccess: (_, id) => {
      // Remove the ticket from cache
      queryClient.removeQueries({ queryKey: ticketKeys.detail(id) });
      
      // Invalidate tickets lists to refetch
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete ticket:', error);
    },
  });
}

// Optimistic update hook for ticket status changes
export function useOptimisticTicketUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTicketRequest }) =>
      ticketsAPI.updateTicket(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ticketKeys.detail(id) });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<Ticket>(ticketKeys.detail(id));

      // Optimistically update the cache
      if (previousTicket) {
        queryClient.setQueryData<Ticket>(ticketKeys.detail(id), {
          ...previousTicket,
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }

      // Return context with the previous value
      return { previousTicket, id };
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousTicket) {
        queryClient.setQueryData(ticketKeys.detail(id), context.previousTicket);
      }
      console.error('Failed to update ticket:', error);
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}