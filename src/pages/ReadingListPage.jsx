import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BookCoverPlaceholder from "../components/BookCoverPlaceholder";
import {
  useMyReadingLists,
  useCreateReadingList,
  useRemoveBookFromReadingList,
  useDeleteReadingList,
} from "../services/readingListService";

// ─── Status tag colours ───────────────────────────────────────────────────────
const statusClass = (s) => (s === "Available" ? "status-available" : "status-borrowed");

function ReadingListPage() {
  const { user } = useAuth();

  const { data: readingLists = [], isLoading, error } = useMyReadingLists(
    user ? { enabled: true } : { enabled: false }
  );
  const createList   = useCreateReadingList();
  const removeBook   = useRemoveBookFromReadingList();
  const deleteList   = useDeleteReadingList();

  // "Create new list" inline form
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]       = useState("");

  // Which list panels are expanded (default: all open)
  const [collapsed, setCollapsed] = useState({});

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createList.mutate(trimmed, {
      onSuccess: () => {
        setNewName("");
        setShowCreate(false);
      },
    });
  };

  const toggleCollapse = (id) =>
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleRemoveBook = (readingListId, bookId) => {
    removeBook.mutate({ readingListId, bookId });
  };

  const handleDeleteList = (readingListId) => {
    if (!window.confirm("Delete this reading list?")) return;
    deleteList.mutate(readingListId);
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem" }}>Loading…</div>
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

  const totalBooks = readingLists.reduce((sum, l) => sum + (l.items?.length ?? 0), 0);

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Reading Lists</h1>
          <p className="page-subtitle">
            {readingLists.length} list{readingLists.length !== 1 ? "s" : ""} · {totalBooks} book{totalBooks !== 1 ? "s" : ""} saved
          </p>
        </div>

        <button
          className="btn btn-gold btn-sm"
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? "✕ Cancel" : "+ New List"}
        </button>
      </div>

      {/* ── Create list form ── */}
      {showCreate && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            padding: "1rem",
            background: "var(--white)",
            borderRadius: 10,
            border: "1px solid var(--cream-dark)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <input
            autoFocus
            className="filter-select"
            style={{ flex: 1 }}
            placeholder="List name (e.g. 'Sci-Fi', 'To Read')"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            maxLength={150}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={handleCreate}
            disabled={!newName.trim() || createList.isPending}
          >
            {createList.isPending ? "Creating…" : "Create"}
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {readingLists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No reading lists yet</h3>
          <p>Create your first list and start saving books to it.</p>
          <button
            className="btn btn-gold"
            style={{ marginTop: "1rem" }}
            onClick={() => setShowCreate(true)}
          >
            + Create a List
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {readingLists.map((list) => {
            const isOpen = !collapsed[list.id];
            const books  = list.items ?? [];

            return (
              <div
                key={list.id}
                style={{
                  border: "1px solid var(--cream-dark)",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "var(--white)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                {/* List header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.85rem 1.1rem",
                    cursor: "pointer",
                    background: "var(--cream-dark)",
                    userSelect: "none",
                  }}
                  onClick={() => toggleCollapse(list.id)}
                >
                  <span style={{ fontSize: "1.1rem", color: "var(--burgundy)" }}>{isOpen ? "▾" : "▸"}</span>
                  <span style={{ fontWeight: 600, flex: 1, fontSize: "1rem", color: "var(--burgundy-dark)" }}>
                    {list.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      opacity: 0.7,
                      marginRight: "0.5rem",
                      fontWeight: 500,
                    }}
                  >
                    {books.length} book{books.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--error)", borderColor: "rgba(155,34,38,0.2)", fontSize: "0.75rem", background: "white" }}
                    onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
                    disabled={deleteList.isPending}
                  >
                    🗑 Delete List
                  </button>
                </div>

                {/* Book rows */}
                {isOpen && (
                  <div>
                    {books.length === 0 ? (
                      <div
                        style={{
                          padding: "1.5rem",
                          textAlign: "center",
                          opacity: 0.6,
                          fontSize: "0.9rem",
                          fontStyle: "italic",
                        }}
                      >
                        No books yet — browse and save some!
                      </div>
                    ) : (
                      <div style={{ padding: "0.5rem" }}>
                        {books.map((b) => (
                          <div
                            key={b.bookId}
                            className="reading-list-item"
                            style={{ 
                              marginBottom: "0.5rem",
                              border: "1px solid var(--cream)",
                              boxShadow: "none"
                            }}
                          >
                          {/* Cover */}
                          <div className="rl-cover">
                            {b.coverImageUrl ? (
                              <img
                                src={b.coverImageUrl}
                                alt={b.bookTitle}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: 6,
                                }}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                            ) : (
                              <BookCoverPlaceholder title={b.bookTitle} />
                            )}
                          </div>

                          {/* Info */}
                          <div className="rl-info" style={{ flex: 1 }}>
                            <div className="rl-title">{b.bookTitle}</div>
                            <div className="rl-meta">{b.ownerName}</div>
                          </div>

                          <span className={`tag ${statusClass(b.status)}`}>
                            {b.status}
                          </span>

                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: "#e74c3c", borderColor: "rgba(231,76,60,0.3)" }}
                            onClick={() => handleRemoveBook(list.id, b.bookId)}
                            disabled={removeBook.isPending}
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
}

export default ReadingListPage;