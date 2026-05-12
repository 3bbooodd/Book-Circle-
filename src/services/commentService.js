/**
 * Comment Service - Backend API integration with React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// API Functions
export const commentApi = {
  getForBook: async (bookId) => {
    const response = await apiClient.get(`/books/${bookId}/comments`);
    return response.data;
  },

  create: async (bookId, commentData) => {
    const payload = {
      Content: commentData.text,
    };
    
    if (commentData.parentCommentId && commentData.parentCommentId !== "") {
      payload.ParentCommentId = commentData.parentCommentId;
    }
    
    const response = await apiClient.post(`/books/${bookId}/comments`, payload);
    return response.data;
  },
};

// React Query Hooks
export const useBookComments = (bookId) => {
  return useQuery({
    queryKey: ['comments', bookId],
    queryFn: () => commentApi.getForBook(bookId),
    enabled: !!bookId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookId, commentData }) => commentApi.create(bookId, commentData),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', bookId] });
    },
  });
};
