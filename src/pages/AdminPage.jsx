import { useState } from "react";
import { G } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import { usePendingUsers, useModerateUser } from "../services/adminService";
import { usePendingBooks, useModerateBook } from "../services/adminService";

function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("users");

  // React Query hooks
  const { data: pendingUsers = [], isLoading: usersLoading, error: usersError } = usePendingUsers(user ? { enabled: !!user } : { enabled: false });
  const { data: pendingBooks = [], isLoading: booksLoading, error: booksError } = usePendingBooks(user ? { enabled: !!user } : { enabled: false });
  const moderateUser = useModerateUser();
  const moderateBook = useModerateBook();

  // 👥 USER ACTIONS
  const approveUser = (userId) => {
    moderateUser.mutate(
      { userId, approve: true },
      {
        onSuccess: () => {
          alert("User approved!");
        },
      }
    );
  };

  const rejectUser = (userId) => {
    moderateUser.mutate(
      { userId, approve: false },
      {
        onSuccess: () => {
          alert("User rejected.");
        },
      }
    );
  };

  // 📚 BOOKS ACTIONS
  const approveBook = (bookId) => {
    moderateBook.mutate(
      { bookId, approve: true },
      {
        onSuccess: () => {
          alert("Book approved!");
        },
      }
    );
  };

  const rejectBook = (bookId) => {
    moderateBook.mutate(
      { bookId, approve: false },
      {
        onSuccess: () => {
          alert("Book rejected!");
        },
      }
    );
  };

  if (usersLoading || booksLoading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem" }}>Loading...</div>
      </div>
    );
  }

  if (usersError || booksError) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ fontSize: "2rem", color: "#e74c3c" }}>
          Error: {(usersError || booksError)?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            Manage users & book approvals
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "1.25rem" }}>
          {[
            ["👥", "Pending Users", pendingUsers.length],
            ["📚", "Pending Books", pendingBooks.length],
          ].map(([icon, label, val]) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                background: "white",
                padding: "0.75rem 1.25rem",
                borderRadius: 10,
                border: `1px solid ${G.creamDark}`,
              }}
            >
              <div style={{ fontSize: "1.5rem" }}>
                {icon}
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: G.burgundy,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: G.muted,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["users", "books"].map((t) => (
          <button
            key={t}
            className={`tab-btn ${
              tab === t ? "active" : ""
            }`}
            onClick={() => setTab(t)}
          >
            {t === "users"
              ? "👥 Pending Users"
              : "📚 Pending Books"}
          </button>
        ))}
      </div>

      {/* USERS TAB */}
      {tab === "users" && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                    No pending users 
                  </td>
                </tr>
              ) : (
                pendingUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                        }}
                      >
                        <div className="comment-avatar">
                          {u.fullName?.[0] || u.userName?.[0] || "?"}
                        </div>
                        {u.fullName || u.userName}
                      </div>
                    </td>

                    <td style={{ color: G.muted }}>
                      {u.email}
                    </td>

                    <td>
                      <span className="tag">
                        {u.roles?.join(', ') || 'N/A'}
                      </span>
                    </td>

                    <td>
                      <span className="tag tag-warning">
                        Pending
                      </span>
                    </td>

                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-sm"
                          style={{ background: "#27ae60", color: "white" }}
                          onClick={() =>
                            approveUser(u.id)
                          }
                        >
                          ✓ Approve
                        </button>

                        <button
                          className="btn btn-sm"
                          style={{ background: "#e74c3c", color: "white" }}
                          onClick={() =>
                            rejectUser(u.id)
                          }
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* BOOKS TAB */}
      {tab === "books" && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Genre</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pendingBooks.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div style={{ textAlign: "center", padding: "1rem" }}>
                      No pending books 
                    </div>
                  </td>
                </tr>
              ) : (
                pendingBooks.map((b) => (
                  <tr key={b.id}>
                    <td
                      style={{
                        fontFamily:
                          "'Playfair Display',serif",
                        fontWeight: 600,
                      }}
                    >
                      {b.title}
                    </td>

                    <td>{b.ownerName || b.ownerId}</td>

                    <td>
                      <span className="tag tag-genre">
                        {b.genre}
                      </span>
                    </td>

                    <td>
                      <span className="tag tag-warning">
                        Pending
                      </span>
                    </td>

                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-sm"
                          style={{ background: "green", color: "white" }}
                          onClick={() =>
                            approveBook(b.id)
                          }
                        >
                          ✓ Approve
                        </button>

                        <button
                          className="btn btn-sm"
                          style={{ background: "red", color: "white" }}
                          onClick={() =>
                            rejectBook(b.id)
                          }
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPage;