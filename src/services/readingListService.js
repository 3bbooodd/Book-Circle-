/**
 * Reading List Service - Backend API integration with React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// API Functions
export const readingListApi = {
  getMine: async () => {
    const response = await apiClient.get('/readinglists');
    return response.data;
  },

  create: async (requestData) => {
    const mappedData = {
      Name: requestData.name,
    };
    const response = await apiClient.post('/readinglists', mappedData);
    return response.data;
  },

  addBook: async (readingListId, bookData) => {
    const mappedData = {
      BookId: bookData.bookId,
    };
    const response = await apiClient.post(`/readinglists/${readingListId}/books`, mappedData);
    return response.data;
  },

  removeBook: async (readingListId, bookId) => {
    await apiClient.delete(`/readinglists/${readingListId}/books/${bookId}`);
  },
};

// React Query Hooks
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
    mutationFn: readingListApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingLists'] });
    },
  });
};

export const useAddBookToReadingList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ readingListId, bookData }) => readingListApi.addBook(readingListId, bookData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingLists'] });
    },
  });
};

export const useRemoveBookFromReadingList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ readingListId, bookId }) => readingListApi.removeBook(readingListId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readingLists'] });
    },
  });
};
