import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '../services/comments';
import type { CreateCommentRequest } from '../types';

// Query keys for React Query cache management
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (ticketId: string) => [...commentKeys.lists(), ticketId] as const,
};

// Hook for fetching comments for a ticket
export function useComments(ticketId: string) {
  return useQuery({
    queryKey: commentKeys.list(ticketId),
    queryFn: () => commentsAPI.getComments(ticketId),
    enabled: !!ticketId, // Only run if ticketId is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
  });
}

// Hook for creating comments
export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: CreateCommentRequest) => 
      commentsAPI.createComment(ticketId, comment),
    onSuccess: () => {
      // Invalidate comments for this ticket to refetch
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(ticketId) 
      });
      
      // Also invalidate the ticket details to update comment count
      queryClient.invalidateQueries({ 
        queryKey: ['tickets', 'detail', ticketId] 
      });
    },
    onError: (error) => {
      console.error('Failed to create comment:', error);
    },
  });
}

// Hook for optimistic comment creation (immediate UI update)
export function useOptimisticCreateComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: CreateCommentRequest) => 
      commentsAPI.createComment(ticketId, comment),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: commentKeys.list(ticketId) 
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<Comment[]>(
        commentKeys.list(ticketId)
      ) || [];

      // Create optimistic comment
      const optimisticComment = {
        id: `temp-${Date.now()}`,
        ...newComment,
        ticketId,
        createdAt: new Date().toISOString(),
      };

      // Optimistically update the cache
      queryClient.setQueryData(
        commentKeys.list(ticketId),
        [...previousComments, optimisticComment]
      );

      // Return context with the previous value
      return { previousComments };
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(ticketId),
          context.previousComments
        );
      }
      console.error('Failed to create comment:', error);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.list(ticketId) 
      });
    },
  });
}