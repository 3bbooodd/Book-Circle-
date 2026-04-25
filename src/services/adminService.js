/**
 * Admin Service - Backend API integration with React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// API Functions
export const adminApi = {
  getPendingUsers: async () => {
    const response = await apiClient.get('/admin/pending-users');
    return response.data;
  },

  moderateUser: async (userId, approve) => {
    await apiClient.put(`/admin/users/${userId}/approval`, { Approve: approve });
  },

  getPendingBooks: async () => {
    const response = await apiClient.get('/admin/pending-books');
    return response.data;
  },

  moderateBook: async (bookId, approve) => {
    await apiClient.put(`/admin/books/${bookId}/approval`, { Approve: approve });
  },
};

// React Query Hooks
export const usePendingUsers = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'pendingUsers'],
    queryFn: () => adminApi.getPendingUsers(),
    ...options,
  });
};

export const usePendingBooks = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'pendingBooks'],
    queryFn: () => adminApi.getPendingBooks(),
    ...options,
  });
};

export const useModerateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, approve }) => adminApi.moderateUser(userId, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingUsers'] });
    },
  });
};

export const useModerateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookId, approve }) => adminApi.moderateBook(bookId, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingBooks'] });
    },
  });
};
