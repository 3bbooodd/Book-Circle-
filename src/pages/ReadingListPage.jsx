function ReadingListPage({ readingList = [], onRemove }) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Reading List</h1>
          <p className="page-subtitle">
            {readingList.length} books saved
          </p>
        </div>
      </div>

      {readingList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📌</div>
          <h3>Your reading list is empty</h3>
          <p>
            Browse books and click Save to add them here
          </p>
        </div>
      ) : (
        readingList.map((b) => (
          <div key={b.id} className="reading-list-item">
            <div className="rl-cover">📖</div>

            <div className="rl-info">
              <div className="rl-title">{b.title}</div>
              <div className="rl-meta">
                {b.owner} · {b.genre} · EGP {b.price}/day
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
              onClick={() => onRemove?.(b.id)}
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