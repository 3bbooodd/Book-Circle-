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
  const [likedBooks, setLikedBooks] = useState(new Set());

  // React Query hooks
  const { data: books = [], isLoading, error } = useBooks({ search, genre, language: lang === "All" ? undefined : lang });
  const reactToBook = useReactToBook();
  const createBorrowRequest = useCreateBorrowRequest();
  const { data: comments = [] } = useBookComments(selected?.id);
  const createComment = useCreateComment();
  const { data: readingLists = [] } = useMyReadingLists(user?.role === "Reader" ? { enabled: !!user } : { enabled: false });
  const addBookToList = useAddBookToReadingList();

  // Get current user's reading list
  const myReadingList = readingLists[0]?.items || [];

  // Find current book in the books array
  const currentBook = books.find((b) => b.id === selected?.id);

  // Extract genres and languages
  const genres = ["All", ...new Set(books.map((b) => b.genre))];
  const langs = ["All", ...new Set(books.map((b) => b.language))];

  const filtered = books
    .filter(b => {
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

  const inList = (id) => myReadingList.some((b) => b.bookId === id);

  const scrollToBooks = () => {
    const section = document.getElementById("books-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLike = (bookId) => {
    const isLiked = likedBooks.has(bookId);
    reactToBook.mutate(
      { bookId, reactionData: { type: isLiked ? "unlike" : "like" } },
      {
        onSuccess: () => {
          setLikedBooks((prev) => {
            const newSet = new Set(prev);
            if (isLiked) {
              newSet.delete(bookId);
            } else {
              newSet.add(bookId);
            }
            return newSet;
          });
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

  const handleAddToList = (book) => {
    const readingListId = readingLists[0]?.id;
    if (!readingListId) return;
    addBookToList.mutate({
      readingListId,
      bookData: { bookId: book.id },
    });
  };

  if (isLoading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem" }}>Loading books...</div>
      </div>
    );
  }

  if (error) {
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
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL WITH COMMENTS --- */}
      {selected && currentBook && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="modal"
            style={{ maxWidth: 750, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title">{currentBook.title}</div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="book-detail-grid">
                <div className="book-detail-cover">
                  {currentBook.coverImageUrl ? (
                    <img src={currentBook.coverImageUrl} alt={currentBook.title} style={{ width: "100%", borderRadius: 8 }} />
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

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    {user?.role === "Reader" && currentBook.status === "Available" && currentBook.approvalStatus === "Approved" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBorrow(currentBook)}
                      >
                        📬 Request Borrow
                      </button>
                    )}
                    {user?.role !== "Admin" && (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleAddToList(currentBook)} disabled={inList(currentBook.id)}>
                        {inList(currentBook.id) ? "✓ In List" : "📌 Save"}
                      </button>
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