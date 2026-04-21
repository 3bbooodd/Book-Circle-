import { useState } from "react";
import BookCard from "../components/BookCard";
import BookCoverPlaceholder from "../components/BookCoverPlaceholder";
import CommentsSection from "../components/CommentsSection"; 

import { G } from "../styles/globalStyles";

function BrowsePage({
  books,
  user,
  onBorrow,
  onAddToList,
  onLike, 
  onAddComment, 
  readingList = [],
}) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [lang, setLang] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [maxPrice, setMaxPrice] = useState("");
  const [selected, setSelected] = useState(null);

  // 🔥 الحل السحري: ابحث عن الكتاب في المصفوفة الأصلية عشان التعليقات تظهر فوراً
  const currentBook = books.find((b) => b.id === selected?.id);

  // 🎯 filters
  const genres = ["All", ...new Set(books.map((b) => b.genre))];
  const langs = ["All", ...new Set(books.map((b) => b.language))];

  const filtered = books
    .filter(b => {
      if (user?.role === 'admin') return true;
      if (user?.role === 'owner' && b.owner === user?.name) return true;
      return b.status === "Available";
    })
    .filter(b => {
      const q = search.toLowerCase();
      const matchesSearch = (
        b.title.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.language.toLowerCase().includes(q) ||
        String(b.price).includes(q)
      );

      const matchesGenre = genre === "All" || b.genre === genre;
      const matchesLang = lang === "All" || b.language === lang;
      const matchesPrice = maxPrice === "" || b.price <= Number(maxPrice);

      return matchesSearch && matchesGenre && matchesLang && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
      return a.title.localeCompare(b.title);
    });

  // const inList = (id) => readingList.some((r) => r.id === id);
  const inList = (id) =>
  (readingList[user?.id] || []).some((b) => b.id === id);

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
            <button className="btn btn-gold" onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}>
              Browse Books
            </button>
          </div>
        </div>
      </div>

      <div className="page">
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
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
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
                onLike={onLike} 
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
                  {currentBook.image ? (
                    <img src={currentBook.image} alt={currentBook.title} style={{ width: "100%", borderRadius: 8 }} />
                  ) : (
                    <BookCoverPlaceholder title={currentBook.title} large />
                  )}
                </div>
                
                <div className="book-detail-info">
                  <div className="book-detail-title">{currentBook.title}</div>
                  <p><strong>ISBN:</strong> {currentBook.isbn}</p>
                  <p><strong>Available From:</strong> {currentBook.fromDate} To {currentBook.toDate}</p>
                  <p><strong>Price:</strong> EGP {currentBook.price}/day</p>
                  <p><strong>Genre:</strong> {currentBook.genre} | <strong>Lang:</strong> {currentBook.language}</p>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    
                     {user?.role === "reader" && selected.status === "Available" && (
                                 <button
                                   className="btn btn-primary btn-sm"
                                   onClick={() => {
                                   onBorrow?.(selected);
                                  setSelected(null);
                              }}
  >
    📬 Request Borrow
  </button>
)}
                    {user?.role!=="admin" && (
                      <button className="btn btn-ghost btn-sm" onClick={() => onAddToList?.(currentBook)} disabled={inList(currentBook.id)}>
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
                comments={currentBook.comments || []}
                user={user}
                onAddComment={onAddComment}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BrowsePage;