import { useState } from "react";
import { G } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import { useMyBooks, useCreateBook, useUpdateBook, useDeleteBook } from "../services/bookService";
import { useOwnerBorrowRequests, useProcessBorrowRequest, useReturnBook } from "../services/borrowService";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

function MyBooksPage() {
  const { user } = useAuth();
  const { toasts, showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  // React Query hooks
  const { data: myBooks = [], isLoading, error } = useMyBooks(user ? { enabled: !!user } : { enabled: false });
  const { data: requests = [] } = useOwnerBorrowRequests(user ? { enabled: !!user } : { enabled: false });
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();
  const processRequest = useProcessBorrowRequest();
  const returnBook = useReturnBook();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    isbn: "",
    language: "English",
    publicationDate: "",
    borrowPrice: "",
    availableFrom: "",
    availableTo: "",
    coverImageUrl: "",
  });

  const openAdd = () => {
    setEditBook(null);
    setForm({
      title: "",
      genre: "",
      isbn: "",
      language: "English",
      publicationDate: "",
      borrowPrice: "",
      availableFrom: "",
      availableTo: "",
      coverImageUrl: "",
    });
    setPreviewError(false);
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditBook(b);
    setForm({
      title: b.title,
      genre: b.genre,
      isbn: b.isbn,
      language: b.language,
      publicationDate: b.publicationDate?.split('T')[0] || "",
      borrowPrice: String(b.borrowPrice),
      availableFrom: b.availableFrom?.split('T')[0] || "",
      availableTo: b.availableTo?.split('T')[0] || "",
      coverImageUrl: b.coverImageUrl || "",
    });
    setPreviewError(false);
    setShowForm(true);
  };

  const save = () => {
    if (!form.title.trim()) {
      showToast("Title is required!", "error");
      return;
    }

    if (form.publicationDate) {
      const pubDate = new Date(form.publicationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (pubDate > today) {
        showToast("Publication Date cannot be in the future!", "error");
        return;
      }

      if (form.availableFrom) {
        const availDate = new Date(form.availableFrom);
        if (pubDate > availDate) {
          showToast("Publication Date cannot be after the Available From date!", "error");
          return;
        }
      }
    }

    const bookData = {
      ...form,
      borrowPrice: Number(form.borrowPrice),
    };

    if (editBook) {
      updateBook.mutate({ bookId: editBook.id, bookData }, {
        onSuccess: () => {
          setShowForm(false);
          setEditBook(null);
          showToast("Book updated successfully!", "success");
        },
        onError: (err) => {
          showToast(err.response?.data?.message || "Failed to update book.", "error");
        }
      });
    } else {
      createBook.mutate(bookData, {
        onSuccess: () => {
          setShowForm(false);
          setEditBook(null);
          showToast("Book submitted for review!", "success");
        },
        onError: (err) => {
          showToast(err.response?.data?.message || "Failed to add book.", "error");
        }
      });
    }
  };

  const del = (id) => {
    const b = myBooks.find((b) => b.id === id);

    if (b?.status === "Borrowed") {
      showToast("Cannot delete a borrowed book!", "error");
      return;
    }

    if (window.confirm("Are you sure you want to remove this book?")) {
      deleteBook.mutate(id, {
        onSuccess: () => {
          showToast("Book removed.", "success");
        },
      });
    }
  };

  const acceptRequest = (req) => {
    processRequest.mutate({
      borrowRequestId: req.id,
      decisionData: { approve: true },
    }, {
      onSuccess: () => {
        showToast("Book borrowed successfully!", "success");
      },
    });
  };

  const rejectRequest = (req) => {
    processRequest.mutate({
      borrowRequestId: req.id,
      decisionData: { approve: false },
    }, {
      onSuccess: () => {
        showToast("Request rejected.", "success");
      },
    });
  };

  const returnRequest = (req) => {
    returnBook.mutate(req.id, {
      onSuccess: () => {
        showToast("Book returned successfully!", "success");
      },
    });
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
          <h1 className="page-title">My Books</h1>
          <p className="page-subtitle">Manage your shared collection</p>
        </div>

        <button className="btn btn-primary" onClick={openAdd}>
          + Add Book
        </button>
      </div>

      {/* TABLE */}
      {myBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>You don't have any books</h3>
          <p>Add your first book to start sharing</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Price/day</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Likes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {myBooks.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontFamily: "'Playfair Display'", fontWeight: 600 }}>
                    {b.title}
                  </td>

                  <td>
                    <span className="tag tag-genre">{b.genre}</span>
                  </td>

                  <td>{b.language}</td>

                  <td>EGP {b.borrowPrice}</td>

                  <td>
                    <span
                      className={`tag ${b.status === "Available"
                          ? "status-available"
                          : b.status === "Borrowed"
                            ? "status-borrowed"
                            : "tag-warning"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`tag ${b.approvalStatus === "Approved"
                          ? "status-available"
                          : b.approvalStatus === "Pending"
                            ? "status-pending"
                            : "tag-danger"
                        }`}
                    >
                      {b.approvalStatus}
                    </span>
                  </td>

                  <td>❤️ {b.likesCount}</td>

                  <td>
                    <div className="td-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(b)}
                      >
                        ✏️
                      </button>

                      <button
                        className="btn btn-sm"
                        style={{ background: G.error, color: "white" }}
                        onClick={() => del(b.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Borrow Requests */}
      {myBooks.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Borrow Requests</h2>
          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">�</div>
              <h3>No borrow requests</h3>
              <p>Requests will appear here when readers want to borrow your books</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.bookTitle}</td>
                      <td>{r.readerName}</td>
                      <td>{r.status}</td>
                      <td>
                        {r.status === "Pending" && (
                          <div style={{ gap: "5px" }}>
                            <button className="btn btn-sm btn-primary" onClick={() => acceptRequest(r)}>
                              ✓ Accept
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => rejectRequest(r)}>
                              ✕ Reject
                            </button>
                          </div>
                        )}
                        {r.status === "Accepted" && (
                          <button
                            className="btn btn-sm"
                            style={{ background: "#27ae60", color: "white" }}
                            onClick={() => returnRequest(r)}
                          >
                            ↩ Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editBook ? "Edit Book" : "Add New Book"}
              </div>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Available From</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.availableFrom}
                    onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Available To</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.availableTo}
                    onChange={(e) => setForm({ ...form, availableTo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    className="form-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Genre</label>
                  <input
                    className="form-input"
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input
                    className="form-input"
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                    className="form-select"
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                  >
                    <option>English</option>
                    <option>Arabic</option>
                    <option>French</option>
                    <option>Spanish</option>
                    <option>German</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Publication Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.publicationDate}
                    onChange={(e) => setForm({ ...form, publicationDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Borrow Price (EGP/day)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.borrowPrice}
                    onChange={(e) => setForm({ ...form, borrowPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Book Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/book-cover.jpg"
                  value={form.coverImageUrl}
                  onChange={(e) => {
                    setForm({ ...form, coverImageUrl: e.target.value });
                    setPreviewError(false);
                  }}
                />
                {form.coverImageUrl && !previewError && (
                  <img
                    src={form.coverImageUrl}
                    alt="preview"
                    onError={() => setPreviewError(true)}
                    style={{
                      marginTop: 10,
                      width: "100%",
                      height: 150,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                )}
                {form.coverImageUrl && previewError && (
                  <div style={{ marginTop: 10, padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: 8, fontSize: '0.8rem' }}>
                    ⚠️ Invalid or unreachable image URL
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={save}>
                {editBook ? "Save Changes" : "Add Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooksPage;