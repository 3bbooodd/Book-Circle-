import { useState, useEffect } from "react";
import { BORROW_REQUESTS } from "../services/mockData";
import { G } from "../styles/globalStyles";

function MyBooksPage({ showToast, books, setBooks, user, onReturnBook }){
  const myBooks = books.filter((b) => b.owner === user?.name);
  
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  
  const [requests, setRequests] = useState(() => {
    return JSON.parse(localStorage.getItem("requests") || "[]");
  });
   const ownerRequests = requests.filter(
  (r) => r.ownerId === user.id
);
  
  // 🔥 حفظ الريكوستات
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    isbn: "",
    language: "English",
    pubDate: "",
    price: "",
    fromDate: "",
    toDate: "",
    image: "",
  });

  const openAdd = () => {
    setEditBook(null);
    setForm({
      title: "",
      genre: "",
      isbn: "",
      language: "English",
      pubDate: "",
      price: "",
      fromDate: "",
      toDate: "",
      image: "",
    });
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditBook(b);
    setForm({ 
      ...b, 
      price: String(b.price), 
      image: b.image || "",
      fromDate: b.fromDate || "",
      toDate: b.toDate || ""
    });
    setShowForm(true);
  };

  // 🔥 دالة الـ SAVE (تجمع بين الـ Create والـ Update)
  const save = () => {
    if (!form.title.trim()) {
        showToast("Title is required!", "error");
        return;
    }

    if (editBook) {
      // --- منطق الـ UPDATE ---
      setBooks((prev) =>
        prev.map((b) =>
          b.id === editBook.id 
            ? { ...b, ...form, price: Number(form.price) } 
            : b
        )
      );
      showToast("Book updated successfully! ✨", "success");
    } else {
      // --- منطق الـ CREATE ---
      const newBook = {
        ...form,
        id: crypto.randomUUID(),
        owner: user?.name || "Unknown",
        price: Number(form.price),
         ownerId: user.id,
        status: "Pending", // يحتاج موافقة أدمن
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      };
      setBooks((prev) => [...prev, newBook]);
      showToast("Book submitted for review ⏳", "success");
    }

    setShowForm(false);
    setEditBook(null);
  };

  const del = (id) => {
    const b = books.find((b) => b.id === id);

    if (b?.status === "Borrowed") {
      showToast("Cannot delete a borrowed book!", "error");
      return;
    }

    if (window.confirm("Are you sure you want to remove this book?")) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        showToast("Book removed.");
    }
  };

  // 🔥 ACCEPT REQUEST
  const acceptRequest = (req) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === req.bookId ? { ...b, status: "Borrowed" } : b
      )
    );

    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: "Accepted" } : r
      )
    );

    showToast("Book borrowed successfully 📕", "success");
  };

  // 🔥 REJECT REQUEST
  const rejectRequest = (req) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: "Rejected" } : r
      )
    );

    showToast("Request rejected ❌", "error");
  };

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
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Language</th>
              <th>Price/day</th>
              <th>Status</th>
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

                <td>EGP {b.price}</td>

                <td>
                  <span
                    className={`tag ${
                      b.status === "Available"
                        ? "status-available"
                        : b.status === "Borrowed"
                        ? "status-borrowed"
                        : "tag-warning"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td>❤️ {b.likes}</td>

                <td>
                  {/* <div className="td-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}>
                      ✏️
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{ background: G.error, color: "white" }}
                      onClick={() => del(b.id)}
                    >
                      🗑
                    </button>
                     
                  </div> */}
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

  {/* 🔥 زرار Return */}
  {b.status === "Borrowed" && (
    <button
      className="btn btn-sm"
      style={{ background: "#27ae60", color: "white" }}
      onClick={() => onReturnBook?.(b.id)}
    >
      ↩ Return
    </button>
  )}
</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 BORROW REQUESTS */}
      <div style={{ marginTop: "2rem" }}>
        <h2>Borrow Requests</h2>
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
              {ownerRequests.map((r) => (
                <tr key={r.id}>
                  <td>{r.book}</td>
                  <td>{r.requester}</td>
                  <td>{r.status}</td>
                  <td>
                    {r.status === "Pending" && (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button className="btn btn-sm btn-primary" onClick={() => acceptRequest(r)}>
                          ✓ Accept
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => rejectRequest(r)}>
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  <label>Available From</label>
                  <input
                    type="date"
                    value={form.fromDate}
                    onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Available To</label>
                  <input
                    type="date"
                    value={form.toDate}
                    onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select
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
                  <label>Publication Date</label>
                  <input
                    type="date"
                    value={form.pubDate}
                    onChange={(e) => setForm({ ...form, pubDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Borrow Price (EGP/day)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Book Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm((prev) => ({ ...prev, image: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    style={{
                      marginTop: 10,
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
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