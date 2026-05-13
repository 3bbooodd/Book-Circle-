import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { getNotifications, markAllAsRead } from '../services/notificationService';

const NotificationContext = createContext(null);

/**
 * Wraps the app and:
 *  - fetches persisted notifications from the API on login
 *  - opens a SignalR connection when the user is logged in
 *  - appends incoming real-time events to the list (already saved by backend)
 *  - exposes { notifications, unreadCount, markAllRead, clearAll }
 */
export function NotificationProvider({ children, user, onToast }) {
  const [notifications, setNotifications] = useState([]);

  // ── Seed from database on login ───────────────────────────────────────────
  useEffect(() => {
    if (!user || user.role === 'Admin') {
      setNotifications([]);
      return;
    }

    getNotifications()
      .then((data) => {
        const mapped = data.map(mapApiNotification).filter(Boolean);
        setNotifications(mapped);
      })
      .catch(() => {
        // If the request fails (e.g. network), start with an empty list
        setNotifications([]);
      });
  }, [user]);

  // ── Real-time handler ─────────────────────────────────────────────────────
  const handleMessage = useCallback((payload) => {
    const notif = buildNotification(payload);
    if (!notif) return;

    // Prepend the incoming real-time notification (backend already saved it)
    setNotifications((prev) => [notif, ...prev]);

    if (onToast) {
      onToast(notif.text, notif.toastType ?? 'info');
    }
  }, [onToast]);

  const isConnected = !!user && user.role !== 'Admin';
  useSignalR(handleMessage, isConnected);

  // ── Actions ───────────────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch {
      // best-effort — still update UI even if server call fails
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
}

// ─── Map API response (DB record) → in-memory notification shape ─────────────

function mapApiNotification(apiNotif) {
  let meta = {};
  try { meta = JSON.parse(apiNotif.payload); } catch { /* ignore */ }

  // Ensure the UTC timestamp has a 'Z' suffix so the browser doesn't
  // misinterpret it as local time (would show 3h ago for UTC+3 users).
  const ts = apiNotif.createdAtUtc.endsWith('Z')
    ? apiNotif.createdAtUtc
    : apiNotif.createdAtUtc + 'Z';

  return {
    id: apiNotif.id,
    ts,
    read: apiNotif.isRead,
    type: deriveType(apiNotif.type),
    icon: deriveIcon(apiNotif.type, meta),
    text: apiNotif.message,
    toastType: deriveToastType(apiNotif.type, meta),
    meta,
  };
}

// ─── Build notification from a live SignalR push ──────────────────────────────

function buildNotification(payload) {
  const id = `notif-${Date.now()}-${Math.random()}`;
  const ts = new Date().toISOString();

  switch (payload.event) {
    case 'BorrowRequestSent':
      return {
        id, ts, read: false, toastType: 'info',
        icon: '📬',
        text: `${payload.readerName} wants to borrow "${payload.bookTitle}"`,
        type: 'borrow-request',
        meta: payload,
      };

    case 'BorrowRequestUpdated': {
      const statusEmoji = { Accepted: '✅', Rejected: '❌', Returned: '📦' }[payload.status] ?? '🔔';
      return {
        id, ts, read: false, toastType: payload.status === 'Accepted' ? 'success' : 'error',
        icon: statusEmoji,
        text: `Your borrow request for "${payload.bookTitle}" was ${payload.status}`,
        type: 'borrow-update',
        meta: payload,
      };
    }

    case 'CommentCreated':
      return {
        id, ts, read: false, toastType: 'info',
        icon: '💬',
        text: `${payload.authorName} commented on your book "${payload.bookTitle}"`,
        type: 'comment',
        meta: payload,
      };

    case 'CommentReplyCreated':
      return {
        id, ts, read: false, toastType: 'info',
        icon: '↩️',
        text: `${payload.authorName} replied to your comment on "${payload.bookTitle}"`,
        type: 'reply',
        meta: payload,
      };

    default:
      return null;
  }
}

// ─── Helpers for mapApiNotification ──────────────────────────────────────────

function deriveType(type) {
  switch (type) {
    case 'BorrowRequestCreated': return 'borrow-request';
    case 'BorrowRequestUpdated': return 'borrow-update';
    case 'CommentCreated':       return 'comment';
    case 'CommentReplyCreated':  return 'reply';
    default:                     return 'info';
  }
}

function deriveIcon(type, meta) {
  switch (type) {
    case 'BorrowRequestCreated': return '📬';
    case 'BorrowRequestUpdated':
      return { Accepted: '✅', Rejected: '❌', Returned: '📦' }[meta?.status] ?? '🔔';
    case 'CommentCreated':       return '💬';
    case 'CommentReplyCreated':  return '↩️';
    default:                     return '🔔';
  }
}

function deriveToastType(type, meta) {
  if (type === 'BorrowRequestUpdated') {
    return meta?.status === 'Accepted' ? 'success' : 'error';
  }
  return 'info';
}
