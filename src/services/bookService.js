/**
 * Book Service - Backend API integration with React Query hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import apiClient from './apiClient';

// API Functions
export const booksApi = {
  browse: async (params = {}) => {
    const { search, genre, language } = params;
    const queryParams = new URLSearchParams();
    if (search && search.trim()) queryParams.append('search', search.trim());
    if (genre && genre !== 'All') queryParams.append('genre', genre);
    if (language && language !== 'All') queryParams.append('language', language);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/books?${queryString}` : '/books';
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (bookId) => {
    const response = await apiClient.get(`/books/${bookId}`);
    return response.data;
  },

  getMine: async () => {
    const response = await apiClient.get('/books/mine');
    return response.data;
  },

  create: async (bookData) => {
    const mappedData = {
      Title: bookData.title,
      Genre: bookData.genre,
      ISBN: bookData.isbn,
      Language: bookData.language,
      PublicationDate: bookData.publicationDate,
      BorrowPrice: bookData.borrowPrice,
      AvailableFrom: bookData.availableFrom,
      AvailableTo: bookData.availableTo,
      CoverImageUrl: bookData.coverImageUrl,
    };
    const response = await apiClient.post('/books', mappedData);
    return response.data;
  },

  update: async (bookId, bookData) => {
    const mappedData = {
      Title: bookData.title,
      Genre: bookData.genre,
      ISBN: bookData.isbn,
      Language: bookData.language,
      PublicationDate: bookData.publicationDate,
      BorrowPrice: bookData.borrowPrice,
      AvailableFrom: bookData.availableFrom,
      AvailableTo: bookData.availableTo,
      CoverImageUrl: bookData.coverImageUrl,
    };
    const response = await apiClient.put(`/books/${bookId}`, mappedData);
    return response.data;
  },

  delete: async (bookId) => {
    await apiClient.delete(`/books/${bookId}`);
  },

  react: async (bookId, reactionData) => {
    // reactionData = { isLike: boolean }
    const response = await apiClient.post(`/books/${bookId}/reaction`, reactionData);
    return response.data;
  },
};

// React Query Hooks
export const useBooks = (params = {}) => {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => booksApi.browse(params),
    placeholderData: keepPreviousData,
  });
};

export const useBookById = (bookId) => {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => booksApi.getById(bookId),
    enabled: !!bookId,
  });
};

export const useMyBooks = (options = {}) => {
  return useQuery({
    queryKey: ['myBooks'],
    queryFn: () => booksApi.getMine(),
    ...options,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: booksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookId, bookData }) => booksApi.update(bookId, bookData),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: booksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
    },
  });
};

export const useReactToBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ bookId, reactionData }) => booksApi.react(bookId, reactionData),
    onSuccess: (_, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });
};
