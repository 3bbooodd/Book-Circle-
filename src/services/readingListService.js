/**
 * Reading List Service - Backend API integration with React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// ─── API Functions ────────────────────────────────────────────────────────────

export const readingListApi = {
  getMine: async () => {
    const response = await apiClient.get('/readinglists');
    return response.data;
  },

  create: async (name) => {
    const response = await apiClient.post('/readinglists', { Name: name });
    return response.data;
  },

  addBook: async (readingListId, bookId) => {
    const response = await apiClient.post(`/readinglists/${readingListId}/books`, { BookId: bookId });
    return response.data;
  },

  removeBook: async (readingListId, bookId) => {
    await apiClient.delete(`/readinglists/${readingListId}/books/${bookId}`);
  },

  deleteList: async (readingListId) => {
    await apiClient.delete(`/readinglists/${readingListId}`);
  },
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

export const useMyReadingLists = (options = {}) => {
  return useQuery({
    queryKey: ['readingLists'],
    queryFn: () => readingListApi.getMine(),
    ...options,
  });
};

export const useCreateReadingList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name) => readingListApi.create(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['readingLists'] }),
  });
};

export const useAddBookToReadingList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ readingListId, bookId }) => readingListApi.addBook(readingListId, bookId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['readingLists'] }),
  });
};

export const useRemoveBookFromReadingList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ readingListId, bookId }) => readingListApi.removeBook(readingListId, bookId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['readingLists'] }),
  });
};

export const useDeleteReadingList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (readingListId) => readingListApi.deleteList(readingListId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['readingLists'] }),
  });
};
