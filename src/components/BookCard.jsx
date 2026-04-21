import BookCoverPlaceholder from "./BookCoverPlaceholder";

function BookCard({ book, user, onLike, onOpen }) {
  const isBorrowed = book.status === "Borrowed";

  return (
    <div
      className="book-card"
      onClick={() => onOpen(book)} // 🔥 يمنع الفتح لو متسلف (اختياري)
      style={{
        opacity: isBorrowed ? 0.7 : 1,
        cursor: isBorrowed ? "not-allowed" : "pointer",
      }}
    >
      <div className="book-cover">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="book-cover-img"
          />
        ) : (
          <BookCoverPlaceholder title={book.title} />
        )}
        <span
  className={`book-status-badge ${
    book.status === "Available"
      ? "status-available"
      : book.status === "Borrowed"
      ? "status-borrowed"
      : "status-pending"
  }`}
>
  {book.status === "Available"
    ? "🟢 Available"
    : book.status === "Borrowed"
    ? "🔴 Borrowed"
    : "🟡 Pending"}
</span>


      </div>

      <div className="book-card-body">
        <div className="book-card-title">{book.title}</div>
        <div className="book-card-owner">by {book.owner}</div>

        <div className="book-card-meta">
          <span className="tag tag-genre">{book.genre}</span>
          <span className="tag tag-lang">{book.language}</span>
        </div>

        <div className="book-card-footer">
          <span className="book-card-price">
            EGP {book.price}/day
          </span>

          {/* <div className="book-card-likes">
            <span
              style={{ cursor: user ? "pointer" : "default" }}
              onClick={(e) => {
                e.stopPropagation();
                if (user && onLike) onLike(book.id);
              }}
            >
              {book.liked ? "❤️" : "🤍"}
            </span>
            {book.likes}
          </div> */}
          {/* <div className="book-card-likes">
  <span
    style={{ cursor: user ? "pointer" : "default" }}
    onClick={(e) => {
      e.stopPropagation();
      if (user && onLike) onLike(book.id);
    }}
  >
    {book.likedBy?.includes(user?.id) ? "❤️" : "🤍"}
  </span>

  {book.likes}
</div> */}
<div className="book-card-likes">
  <span
    style={{ cursor: "pointer" }}
    onClick={(e) => {
      e.stopPropagation(); // 🔥 مهم
      console.log("LIKE CLICKED"); // 🧪 test
      if (user && onLike) {
        onLike(book.id);
      }
    }}
  >
    {book.likedBy?.includes(user?.id) ? "❤️" : "🤍"}
  </span>

  {book.likes}
</div>
        </div>

        
          {book.status === "Borrowed" && (
  <span style={{ color: "red", fontSize: "0.85rem" }}>
    This book is currently borrowed
  </span>
)}
        {/* 🔥 رسالة لو Pending */}
        {book.status === "Pending" && (
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.8rem",
              color: "#b7950b",
              fontWeight: "500",
            }}
          >
            ⏳ Waiting for admin approval
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCard;