/**
 * Borrow Service - Backend API integration with React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// API Functions
export const borrowApi = {
  createRequest: async (bookId, requestData) => {
    const mappedData = {
      RequestedFrom: requestData.requestedFrom || new Date().toISOString().split('T')[0],
      RequestedTo: requestData.requestedTo || new Date().toISOString().split('T')[0],
      Message: requestData.message || null,
    };
    const response = await apiClient.post(`/borrow/books/${bookId}/requests`, mappedData);
    return response.data;
  },

  getReaderRequests: async () => {
    const response = await apiClient.get('/borrow/my-requests');
    return response.data;
  },

  getOwnerRequests: async () => {
    const response = await apiClient.get('/borrow/owner-requests');
    return response.data;
  },

  processRequest: async (borrowRequestId, decisionData) => {
    const mappedData = {
      Approve: decisionData.approve,
    };
    const response = await apiClient.put(`/borrow/requests/${borrowRequestId}/decision`, mappedData);
    return response.data;
  },

  returnBook: async (borrowRequestId) => {
    const response = await apiClient.put(`/borrow/requests/${borrowRequestId}/return`);
    return response.data;
  },
};

// React Query Hooks
export const useReaderBorrowRequests = (options = {}) => {
  return useQuery({
    queryKey: ['borrowRequests', 'reader'],
    queryFn: () => borrowApi.getReaderRequests(),
    ...options,
  });
};

export const useOwnerBorrowRequests = (options = {}) => {
  return useQuery({
    queryKey: ['borrowRequests', 'owner'],
    queryFn: () => borrowApi.getOwnerRequests(),
    ...options,
  });
};

export const useCreateBorrowRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookId, requestData }) => borrowApi.createRequest(bookId, requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowRequests'] });
    },
  });
};

export const useProcessBorrowRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ borrowRequestId, decisionData }) => borrowApi.processRequest(borrowRequestId, decisionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowRequests'] });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (borrowRequestId) => borrowApi.returnBook(borrowRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowRequests'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
