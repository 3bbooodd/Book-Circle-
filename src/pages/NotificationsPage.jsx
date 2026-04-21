import { useEffect, useState } from "react";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  // 🧠 Load + Fix duplicates
  const loadNotifications = () => {
    const requests = JSON.parse(localStorage.getItem("requests") || "[]");
    const comments = JSON.parse(localStorage.getItem("notifications") || "[]");

    const reqNotifs = requests.map((r) => ({
      id: "req-" + r.id, // 🔥 نخلي ID مختلف
      type: "request",
      text: `${r.requester} requested your book`,
      book: r.book,
      time: "Just now",
    }));

    const commentNotifs = comments.map((c) => ({
      id: "com-" + c.id, // 🔥 مهم عشان ميتكرر
      type: "comment",
      text: c.text,
      book: c.book || "",
      time: c.time || "Just now",
    }));

    const all = [...reqNotifs, ...commentNotifs];

    // 🔥 إزالة التكرار
    const unique = all.filter(
      (item, index, self) =>
        index === self.findIndex((i) => i.id === item.id)
    );

    setNotifications(unique.reverse());
  };

  useEffect(() => {
    loadNotifications();

    const handler = () => {
      loadNotifications();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("newNotification", handler);

    return () => {
      window.removeEventListener("newNotification", handler);
    };
  }, []);

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
            <div key={n.id} className="notification-card">
              
              {/* 🔥 ICON */}
              

              <div className="notif-content">
                <div className="notif-title">{n.text}</div>

                {n.book && (
                  <div className="notif-sub">"{n.book}"</div>
                )}
              </div>

              <div className="notif-time">{n.time}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;