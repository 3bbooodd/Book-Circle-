import { useAuth } from "../context/AuthContext";
import { useMyReadingLists, useRemoveBookFromReadingList } from "../services/readingListService";

function ReadingListPage() {
  const { user } = useAuth();
  const { data: readingLists = [], isLoading, error } = useMyReadingLists(user ? { enabled: !!user } : { enabled: false });
  const removeBookFromList = useRemoveBookFromReadingList();

  // Get the first reading list and its books
  const readingList = readingLists[0] || {};
  const books = readingList.items || [];
  const readingListId = readingList.id;

  const handleRemove = (bookId) => {
    if (!readingListId) return;
    removeBookFromList.mutate(
      { readingListId, bookId },
      {
        onSuccess: () => {
          alert("Book removed from reading list");
        },
      }
    );
  };

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
          <h1 className="page-title">My Reading List</h1>
          <p className="page-subtitle">
            {books.length} books saved
          </p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📌</div>
          <h3>Your reading list is empty</h3>
          <p>
            Browse books and click Save to add them here
          </p>
        </div>
      ) : (
        books.map((b) => (
          <div key={b.bookId} className="reading-list-item">
            <div className="rl-cover">
              {b.coverImageUrl ? (
                <img src={b.coverImageUrl} alt={b.bookTitle} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
              ) : (
                "📖"
              )}
            </div>

            <div className="rl-info">
              <div className="rl-title">{b.bookTitle}</div>
              <div className="rl-meta">
                {b.ownerName}
              </div>
            </div>

            <span
              className={`tag ${
                b.status === "Available"
                  ? "status-available"
                  : "status-borrowed"
              }`}
            >
              {b.status}
            </span>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => handleRemove(b.bookId)}
            >
              ✕ Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ReadingListPage;