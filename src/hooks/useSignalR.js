import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { getAccessToken } from '../services/apiClient';

const HUB_URL = 'http://localhost:5213/hubs/notifications';

/**
 * Opens a SignalR connection to the NotificationHub.
 * Calls onMessage(payload) for every event received.
 * Automatically reconnects on drop. Cleans up on unmount.
 *
 * @param {(payload: object) => void} onMessage
 * @param {boolean} enabled - set false when user is not logged in
 */
export function useSignalR(onMessage, enabled = true) {
  // Keep a stable ref to the latest onMessage so we don't need to
  // restart the connection when the callback identity changes.
  const onMessageRef = useRef(onMessage);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  useEffect(() => {
    if (!enabled) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => getAccessToken() ?? '',
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    const dispatch = (event) => (payload) =>
      onMessageRef.current({ event, ...payload });

    // Match exactly the event names the backend sends via SendAsync(...)
    connection.on('BorrowRequestSent',    dispatch('BorrowRequestSent'));
    connection.on('BorrowRequestUpdated', dispatch('BorrowRequestUpdated'));
    connection.on('CommentCreated',       dispatch('CommentCreated'));
    connection.on('CommentReplyCreated',  dispatch('CommentReplyCreated'));

    connection
      .start()
      .then(() => console.log('[SignalR] Connected to NotificationHub'))
      .catch((err) => console.error('[SignalR] Connection error:', err));

    return () => {
      connection.stop().then(() => console.log('[SignalR] Disconnected'));
    };
  }, [enabled]); // only re-run when auth state changes
}
