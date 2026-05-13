import { useState } from "react";
import BookCoverPlaceholder from "./BookCoverPlaceholder";

function BookCard({ book, user, onLike, onOpen }) {
  const [imageError, setImageError] = useState(false);
  const isBorrowed = book.status === "Borrowed";

  return (
    <div
      className="book-card"
      onClick={() => onOpen(book)}
      style={{
        opacity: isBorrowed ? 0.7 : 1,
        cursor: isBorrowed ? "not-allowed" : "pointer",
      }}
    >
      <div className="book-cover">
        {book.coverImageUrl && !imageError ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="book-cover-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <BookCoverPlaceholder title={book.title} />
        )}
        <span
  className={`book-status-badge ${
    book.approvalStatus === "Pending"
      ? "status-pending"
      : book.status === "Available"
      ? "status-available"
      : "status-borrowed"
  }`}
>
  {book.approvalStatus === "Pending"
    ? "Pending"
    : book.status === "Available"
    ? "Available"
    : "Borrowed"}
</span>


      </div>

      <div className="book-card-body">
        <div className="book-card-title">{book.title}</div>
        <div className="book-card-owner">by {book.ownerName}</div>

        <div className="book-card-meta">
          <span className="tag tag-genre">{book.genre}</span>
          <span className="tag tag-lang">{book.language}</span>
        </div>

        <div className="book-card-footer">
          <span className="book-card-price">
            EGP {book.borrowPrice}/day
          </span>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div className="book-card-likes">
              <span
                style={{ 
                  cursor: (user && user.role === 'Reader') ? "pointer" : user ? "not-allowed" : "default",
                  opacity: (user && user.role === 'Reader') ? 1 : 0.6,
                  filter: book.userReaction === "Like" ? "none" : "grayscale(1)"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    alert("Please log in to like books.");
                    return;
                  }
                  if (user.role !== 'Reader') {
                    alert("Only Readers can react to books.");
                    return;
                  }
                  if (onLike) {
                    onLike(book.id, true);
                  }
                }}
              >
                ❤️
              </span>
              {book.likesCount}
            </div>

            <div className="book-card-likes">
              <span
                style={{ 
                  cursor: (user && user.role === 'Reader') ? "pointer" : user ? "not-allowed" : "default",
                  opacity: (user && user.role === 'Reader') ? 1 : 0.6,
                  filter: book.userReaction === "Dislike" ? "none" : "grayscale(1)"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    alert("Please log in to dislike books.");
                    return;
                  }
                  if (user.role !== 'Reader') {
                    alert("Only Readers can react to books.");
                    return;
                  }
                  if (onLike) {
                    onLike(book.id, false);
                  }
                }}
              >
                👎
              </span>
              {book.dislikesCount}
            </div>
          </div>
        </div>

        <div className="book-card-status">
          {book.status === "Borrowed" && (
            <span style={{ color: "red", fontSize: "0.85rem" }}>
              This book is currently borrowed
            </span>
          )}
          {book.approvalStatus === "Pending" && (
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                color: "#b7950b",
                fontWeight: "500",
              }}
            >
              Waiting for admin approval
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;