import { apiClient } from './api';
import type { Comment, CreateCommentRequest } from '../types';

export class CommentsAPI {
  private static readonly BASE_PATH = '/tickets';

  // Get all comments for a ticket
  static async getComments(ticketId: string): Promise<Comment[]> {
    const response = await apiClient.get<Comment[]>(`${this.BASE_PATH}/${ticketId}/comments`);
    return response.data;
  }

  // Add a comment to a ticket
  static async createComment(ticketId: string, comment: CreateCommentRequest): Promise<Comment> {
    const response = await apiClient.post<Comment>(
      `${this.BASE_PATH}/${ticketId}/comments`,
      comment
    );
    return response.data;
  }
}

// Export individual functions for easier use with React Query
export const commentsAPI = {
  getComments: CommentsAPI.getComments,
  createComment: CommentsAPI.createComment,
};