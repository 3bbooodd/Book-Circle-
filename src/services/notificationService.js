import apiClient from './apiClient';

/**
 * Fetch all notifications for the current user (newest first).
 * @returns {Promise<Array>}
 */
export async function getNotifications() {
  const { data } = await apiClient.get('/notifications');
  return data;
}

/**
 * Mark every unread notification as read on the server.
 * @returns {Promise<void>}
 */
export async function markAllAsRead() {
  await apiClient.put('/notifications/read-all');
}
