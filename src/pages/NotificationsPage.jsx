import { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext";

function NotificationsPage() {
  const { notifications, markAllRead } = useNotifications();

  // Mark all as read when visiting the page
  useEffect(() => {
    if (notifications.length > 0 && notifications.some(n => !n.read)) {
      markAllRead();
    }
  }, [markAllRead, notifications]);

  // Helper to format the timestamp
  const formatTime = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Stay updated with activity
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>You'll see updates here</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`notification-card ${n.read ? "" : "unread"}`}
              style={!n.read ? { borderLeft: "4px solid var(--gold)" } : {}}
            >
              <div className="notif-icon">{n.icon || "🔔"}</div>
              <div className="notif-content">
                <div className="notif-title">{n.text}</div>

                {n.meta?.bookTitle && (
                  <div className="notif-sub">"{n.meta.bookTitle}"</div>
                )}
                
                <div className="notif-time">{formatTime(n.ts)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;