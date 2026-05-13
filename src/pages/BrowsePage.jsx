import { useState } from "react";
import BookCard from "../components/BookCard";
import BookCoverPlaceholder from "../components/BookCoverPlaceholder";
import CommentsSection from "../components/CommentsSection";
import { useAuth } from "../context/AuthContext";
import { useBooks, useReactToBook } from "../services/bookService";
import { useCreateBorrowRequest } from "../services/borrowService";
import { useBookComments, useCreateComment } from "../services/commentService";
import { useMyReadingLists, useAddBookToReadingList } from "../services/readingListService";

import { G } from "../styles/globalStyles";

function BrowsePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [lang, setLang] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [maxPrice, setMaxPrice] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalImageError, setModalImageError] = useState(false);
  // Reading list picker state (per book modal)
  const [showListPicker, setShowListPicker] = useState(false);
  const [pickerListId, setPickerListId] = useState("");

  // React Query hooks
  const { data: books = [], isLoading, error } = useBooks({ search, genre, language: lang === "All" ? undefined : lang });
  // Also fetch all books once (cached) to derive the full list of genres/languages for the filters
  const { data: allBooks = [] } = useBooks({}); 

  const reactToBook = useReactToBook();
  const createBorrowRequest = useCreateBorrowRequest();
  const { data: comments = [] } = useBookComments(selected?.id);
  const createComment = useCreateComment();
  const { data: readingLists = [] } = useMyReadingLists(user?.role === "Reader" ? { enabled: !!user } : { enabled: false });
  const addBookToList = useAddBookToReadingList();

  // Compute per-book membership across ALL reading lists
  const inList = (id) => readingLists.some((l) => l.items?.some((b) => b.bookId === id));
  const whichLists = (id) => readingLists.filter((l) => l.items?.some((b) => b.bookId === id));

  // Find current book in the books array
  const currentBook = books.find((b) => b.id === selected?.id);
  const genres = ["All", ...new Set(allBooks.map((b) => b.genre))];
  const langs = ["All", ...new Set(allBooks.map((b) => b.language))];

  const filtered = books.filter(b => {
      if (user?.role === 'Admin') return true;
      if (user?.role === 'BookOwner' && b.ownerId === user?.id) return true;
      return true; // Show all books regardless of status
    })
    .filter(b => {
      const q = search.toLowerCase();
      const matchesSearch = (
        b.title.toLowerCase().includes(q) ||
        (b.ownerName && b.ownerName.toLowerCase().includes(q)) ||
        b.genre.toLowerCase().includes(q) ||
        b.language.toLowerCase().includes(q) ||
        String(b.borrowPrice).includes(q)
      );

      const matchesGenre = genre === "All" || b.genre === genre;
      const matchesLang = lang === "All" || b.language === lang;
      const matchesPrice = maxPrice === "" || b.borrowPrice <= Number(maxPrice);

      return matchesSearch && matchesGenre && matchesLang && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.borrowPrice - b.borrowPrice;
      if (sortBy === "likes") return (b.likesCount || 0) - (a.likesCount || 0);
      return a.title.localeCompare(b.title);
    });

  const scrollToBooks = () => {
    const section = document.getElementById("books-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReaction = (bookId, isLike) => {
    reactToBook.mutate(
      { bookId, reactionData: { isLike } },
      {
        onSuccess: () => {
          // No need for local state, React Query will invalidate and refetch
        },
      }
    );
  };

  const handleBorrow = (book) => {
    createBorrowRequest.mutate(
      { bookId: book.id, requestData: {} },
      {
        onSuccess: () => {
          setSelected(null);
        },
      }
    );
  };

  const handleAddComment = (bookId, text, parentCommentId = null) => {
    createComment.mutate({
      bookId,
      commentData: { text, parentCommentId },
    });
  };

  const openListPicker = () => {
    setShowListPicker(true);
    setPickerListId(readingLists[0]?.id ?? "");
  };

  const handleAddToList = () => {
    if (!pickerListId) return;
    addBookToList.mutate(
      { readingListId: pickerListId, bookId: selected.id },
      { onSuccess: () => setShowListPicker(false) }
    );
  };

  // Only show full-page loading if it's the absolute first load and we have no data
  const isInitialLoading = isLoading && books.length === 0;

  if (isInitialLoading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem" }}>Loading books...</div>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem", color: "#e74c3c" }}>
          Error loading books: {error.message}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* --- HERO SECTION --- */}
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Share stories,<br />
            <em>build community.</em>
          </h1>
          <p className="hero-sub">
            BookCircle connects book lovers — lend, borrow, and discover your next great read.
          </p>
          <div className="hero-actions">
            <button onClick={scrollToBooks} className="btn btn-gold">
              Browse Books
            </button>
          </div>
        </div>
      </div>

      <div id="books-section" className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Discover Books</h1>
            <p className="page-subtitle">
              Browse our community library — {filtered.length} books found
            </p>
          </div>

          <div className="search-bar">
            <input
              placeholder="Search title, owner…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- FILTERS --- */}
        <div className="filter-row">
          <select className="filter-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((g) => <option key={g}>{g}</option>)}
          </select>

          <select className="filter-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            {langs.map((l) => <option key={l}>{l}</option>)}
          </select>

          <input
            type="number"
            className="filter-select"
            placeholder="Max Price"
            min="0"
            value={maxPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (Number(value) >= 0)) {
                setMaxPrice(value);
              }
            }}
          />

          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Sort: Title</option>
            <option value="price">Sort: Price</option>
            <option value="likes">Sort: Most Liked</option>
          </select>
        </div>

        {/* --- BOOKS GRID --- */}
        <div style={{ minHeight: '400px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No books found</h3>
          </div>
        ) : (
          <div className="books-grid">
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                user={user}
                onOpen={setSelected}
                onLike={handleReaction}
              />
            ))}
          </div>
        )}
        </div>
      </div>

      {/* --- MODAL WITH COMMENTS --- */}
      {selected && currentBook && (
        <div className="modal-overlay" onClick={() => {
          setSelected(null);
          setModalImageError(false);
        }}>
          <div
            className="modal"
            style={{ maxWidth: 750, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title">{currentBook.title}</div>
              <button className="modal-close" onClick={() => {
                setSelected(null);
                setModalImageError(false);
              }}>✕</button>
            </div>

            <div className="modal-body">
              <div className="book-detail-grid">
                <div className="book-detail-cover">
                  {currentBook.coverImageUrl && !modalImageError ? (
                    <img 
                      src={currentBook.coverImageUrl} 
                      alt={currentBook.title} 
                      style={{ width: "100%", borderRadius: 8 }} 
                      onError={() => setModalImageError(true)}
                    />
                  ) : (
                    <BookCoverPlaceholder title={currentBook.title} large />
                  )}
                </div>
                
                <div className="book-detail-info">
                  <div className="book-detail-title">{currentBook.title}</div>
                  <p><strong>ISBN:</strong> {currentBook.isbn}</p>
                  <p><strong>Available From:</strong> {currentBook.availableFrom} To {currentBook.availableTo}</p>
                  <p><strong>Price:</strong> EGP {currentBook.borrowPrice}/day</p>
                  <p><strong>Genre:</strong> {currentBook.genre} | <strong>Lang:</strong> {currentBook.language}</p>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                    {user?.role === "Reader" && currentBook.status === "Available" && currentBook.approvalStatus === "Approved" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBorrow(currentBook)}
                      >
                        📬 Request Borrow
                      </button>
                    )}

                    {/* Reading list picker — only for Reader role */}
                    {user?.role === "Reader" && (
                      <div style={{ position: "relative" }}>
                        {!showListPicker ? (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={openListPicker}
                            disabled={inList(currentBook.id)}
                          >
                            {inList(currentBook.id) ? "✓ Saved" : "📌 Save to List"}
                          </button>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "0.4rem",
                              alignItems: "center",
                              background: "var(--cream-dark)",
                              border: "1px solid var(--muted)",
                              borderRadius: 8,
                              padding: "0.35rem 0.5rem",
                            }}
                          >
                            {readingLists.length === 0 ? (
                              <span style={{ fontSize: "0.82rem", opacity: 0.7 }}>
                                No lists yet — go to Reading List page to create one
                              </span>
                            ) : (
                              <>
                                <select
                                  className="filter-select"
                                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.82rem" }}
                                  value={pickerListId}
                                  onChange={(e) => setPickerListId(e.target.value)}
                                >
                                  {readingLists.map((l) => (
                                    <option key={l.id} value={l.id}>
                                      {l.name} ({l.items?.length ?? 0} books)
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{ fontSize: "0.8rem" }}
                                  onClick={handleAddToList}
                                  disabled={addBookToList.isPending}
                                >
                                  {addBookToList.isPending ? "…" : "Add"}
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: "0.8rem" }}
                              onClick={() => setShowListPicker(false)}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* --- قسم التعليقات المحدث --- */}
              <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />
              <CommentsSection 
                bookId={currentBook.id}
                comments={comments}
                user={user}
                onAddComment={handleAddComment}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BrowsePage;