import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useReaderBorrowRequests } from "../services/borrowService";
import { useMyBooks } from "../services/bookService";
import apiClient from "../services/apiClient";

function NotificationsPage() {
  const { user } = useAuth();
  const { data: requests = [], isLoading, error } = useReaderBorrowRequests(user ? { enabled: !!user } : { enabled: false });
  const { data: myBooks = [] } = useMyBooks(user?.role === "BookOwner" ? { enabled: !!user } : { enabled: false });
  const [commentNotifications, setCommentNotifications] = useState([]);

  // Fetch comments for each book when myBooks changes
  useEffect(() => {
    if (!myBooks || myBooks.length === 0) return;

    const fetchCommentsForBooks = async () => {
      const allComments = [];
      
      // Only fetch comments for approved books
      const approvedBooks = myBooks.filter(book => book.approvalStatus === "Approved");
      
      for (const book of approvedBooks) {
        try {
          const response = await apiClient.get(`/books/${book.id}/comments`);
          const comments = response.data;
          // Only show comments from other users (not from the book owner)
          const otherUserComments = comments.filter(c => c.userId !== user.id);
          otherUserComments.forEach(comment => {
            allComments.push({
              id: `comment-${comment.id}`,
              type: "comment",
              text: `${comment.userName} commented on your book "${book.title}"`,
              book: comment.content,
            });
          });
        } catch (error) {
          console.error(`Failed to fetch comments for book ${book.id}:`, error);
        }
      }
      
      setCommentNotifications(allComments);
    };

    fetchCommentsForBooks();
  }, [myBooks, user?.id]);

  // Convert borrow requests to notification format (exclude returned requests)
  const borrowRequestNotifications = requests
    .filter((r) => r.status !== "Returned")
    .map((r) => ({
      id: "req-" + r.id,
      type: "request",
      text: `Your request for "${r.bookTitle}" is ${r.status}`,
      book: r.bookTitle,
    }));

  // Convert book approval status to notifications
  const bookApprovalNotifications = myBooks.map(book => ({
    id: `book-status-${book.id}`,
    type: "book-approval",
    text: `Your book "${book.title}" is ${book.approvalStatus}`,
    book: book.title,
  }));

  // Combine all notifications
  const allNotifications = [...commentNotifications, ...borrowRequestNotifications, ...bookApprovalNotifications];

  if (isLoading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem" }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem", color: "#e74c3c" }}>
          Error: {error.message}
        </div>
      </div>
    );
  }

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

      {allNotifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>You'll see updates here</p>
        </div>
      ) : (
        <div className="notifications-list">
          {allNotifications.map((n) => (
            <div key={n.id} className="notification-card">
              <div className="notif-content">
                <div className="notif-title">{n.text}</div>

                {n.book && (
                  <div className="notif-sub">"{n.book}"</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;