/**
 * Admin Service - Backend API integration with React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

// API Functions
export const adminApi = {
  // ── Pending approvals ──────────────────────────────────────
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

  getAllBooks: async () => {
    const response = await apiClient.get('/admin/books');
    return response.data;
  },

  // ── User management (new endpoints) ───────────────────────
  /**
   * GET /api/admin/users?role=&approvalStatus=&isActive=
   * Returns all users, optionally filtered.
   */
  getAllUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.role && filters.role !== 'All') params.append('role', filters.role);
    if (filters.approvalStatus && filters.approvalStatus !== 'All')
      params.append('approvalStatus', filters.approvalStatus);
    if (filters.isActive !== undefined && filters.isActive !== 'All')
      params.append('isActive', filters.isActive);

    const qs = params.toString();
    const url = qs ? `/admin/users?${qs}` : '/admin/users';
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * GET /api/admin/users/{userId}
   */
  getUserById: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * PUT /api/admin/users/{userId}/active-status
   * Body: { IsActive: bool }
   */
  setUserActiveStatus: async (userId, isActive) => {
    await apiClient.put(`/admin/users/${userId}/active-status`, { IsActive: isActive });
  },

  /**
   * PUT /api/admin/users/{userId}/role
   * Body: { NewRole: string }
   */
  changeUserRole: async (userId, newRole) => {
    await apiClient.put(`/admin/users/${userId}/role`, { NewRole: newRole });
  },
};

// ── React Query Hooks ──────────────────────────────────────────

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

export const useAllBooks = (options = {}) => {
  return useQuery({
    queryKey: ['admin', 'allBooks'],
    queryFn: () => adminApi.getAllBooks(),
    ...options,
  });
};

export const useAllUsers = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'allUsers', filters],
    queryFn: () => adminApi.getAllUsers(filters),
    ...options,
  });
};

export const useUserById = (userId, options = {}) => {
  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => adminApi.getUserById(userId),
    enabled: !!userId,
    ...options,
  });
};

export const useModerateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, approve }) => adminApi.moderateUser(userId, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingUsers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'allUsers'] });
    },
  });
};

export const useModerateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, approve }) => adminApi.moderateBook(bookId, approve),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingBooks'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'allBooks'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useSetUserActiveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }) => adminApi.setUserActiveStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'allUsers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'pendingUsers'] });
    },
  });
};

export const useChangeUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, newRole }) => adminApi.changeUserRole(userId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'allUsers'] });
    },
  });
};
