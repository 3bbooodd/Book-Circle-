import { useState } from "react";
import { G } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import {
  usePendingUsers,
  useModerateUser,
  usePendingBooks,
  useModerateBook,
  useAllBooks,
  useAllUsers,
  useSetUserActiveStatus,
  useChangeUserRole,
} from "../services/adminService";

// Only Reader and BookOwner are allowed — Admin cannot be assigned via this endpoint
const ROLES = ["Reader", "BookOwner"];

function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("users");

  // ── All Users tab filters ──────────────────────────────────
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");

  // ── Inline role-change state ───────────────────────────────
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [pendingRole, setPendingRole] = useState("");

  // ── React Query hooks ──────────────────────────────────────
  const { data: pendingUsers = [], isLoading: usersLoading, error: usersError } =
    usePendingUsers(user ? { enabled: !!user } : { enabled: false });

  const { data: pendingBooks = [], isLoading: booksLoading, error: booksError } =
    usePendingBooks(user ? { enabled: !!user } : { enabled: false });

  const allUsersFilters = {
    role: roleFilter,
    approvalStatus: statusFilter,
    isActive: activeFilter === "All" ? undefined : activeFilter === "Active",
  };
  const { data: allUsers = [], isLoading: allUsersLoading, error: allUsersError } =
    useAllUsers(allUsersFilters, user ? { enabled: !!user && tab === "allUsers" } : { enabled: false });

  const { data: allBooks = [], isLoading: allBooksLoading, error: allBooksError } =
    useAllBooks(user ? { enabled: !!user && tab === "allBooks" } : { enabled: false });

  const moderateUser = useModerateUser();
  const moderateBook = useModerateBook();
  const setActiveStatus = useSetUserActiveStatus();
  const changeRole = useChangeUserRole();

  // ── Handlers ───────────────────────────────────────────────
  const approveUser = (userId) => {
    moderateUser.mutate({ userId, approve: true }, {
      onSuccess: () => alert("User approved!"),
    });
  };

  const rejectUser = (userId) => {
    moderateUser.mutate({ userId, approve: false }, {
      onSuccess: () => alert("User rejected."),
    });
  };

  const approveBook = (bookId) => {
    moderateBook.mutate({ bookId, approve: true }, {
      onSuccess: () => alert("Book approved!"),
    });
  };

  const rejectBook = (bookId) => {
    moderateBook.mutate({ bookId, approve: false }, {
      onSuccess: () => alert("Book rejected!"),
    });
  };

  const toggleActive = (u) => {
    const newStatus = !u.isActive;
    setActiveStatus.mutate({ userId: u.id, isActive: newStatus }, {
      onSuccess: () => alert(`User ${newStatus ? "activated" : "deactivated"}.`),
    });
  };

  const startEditRole = (u) => {
    setEditingRoleUserId(u.id);
    setPendingRole(u.roles?.[0] || "Reader");
  };

  const confirmRoleChange = (userId) => {
    changeRole.mutate({ userId, newRole: pendingRole }, {
      onSuccess: () => {
        alert(`Role changed to ${pendingRole}.`);
        setEditingRoleUserId(null);
      },
    });
  };

  if ((tab !== "allUsers" && tab !== "allBooks" && (usersLoading || booksLoading))) {
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
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage users, roles &amp; book approvals</p>
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
              <div style={{ fontSize: "1.5rem" }}>{icon}</div>
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
              <div style={{ fontSize: "0.75rem", color: G.muted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: "users", label: "👥 Pending Users" },
          { key: "books", label: "📚 Pending Books" },
          { key: "allBooks", label: "🗂️ All Books" },
          { key: "allUsers", label: "🗂️ All Users" },
        ].map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PENDING USERS TAB ─────────────────────────────── */}
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
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div className="comment-avatar">
                          {u.fullName?.[0] || u.userName?.[0] || "?"}
                        </div>
                        {u.fullName || u.userName}
                      </div>
                    </td>
                    <td style={{ color: G.muted }}>{u.email}</td>
                    <td>
                      <span className="tag">{u.roles?.join(", ") || "N/A"}</span>
                    </td>
                    <td>
                      <span className="tag tag-warning">Pending</span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-sm"
                          style={{ background: "#27ae60", color: "white" }}
                          onClick={() => approveUser(u.id)}
                          disabled={moderateUser.isPending}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: "#e74c3c", color: "white" }}
                          onClick={() => rejectUser(u.id)}
                          disabled={moderateUser.isPending}
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

      {/* ── PENDING BOOKS TAB ─────────────────────────────── */}
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
                        fontFamily: "'Playfair Display',serif",
                        fontWeight: 600,
                      }}
                    >
                      {b.title}
                    </td>
                    <td>{b.ownerName || b.ownerId}</td>
                    <td>
                      <span className="tag tag-genre">{b.genre}</span>
                    </td>
                    <td>
                      <span className="tag tag-warning">Pending</span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button
                          className="btn btn-sm"
                          style={{ background: "green", color: "white" }}
                          onClick={() => approveBook(b.id)}
                          disabled={moderateBook.isPending}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: "red", color: "white" }}
                          onClick={() => rejectBook(b.id)}
                          disabled={moderateBook.isPending}
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

      {/* ── ALL BOOKS TAB ─────────────────────────────── */}
      {tab === "allBooks" && (
        <>
          {allBooksLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading books…</div>
          ) : allBooksError ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#e74c3c" }}>
              Error: {allBooksError.message}
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>Genre</th>
                    <th>Status</th>
                    <th>Approval</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allBooks.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                        No books found
                      </td>
                    </tr>
                  ) : (
                    allBooks.map((b) => (
                      <tr key={b.id}>
                        <td style={{ fontFamily: "'Playfair Display',serif", fontWeight: 600 }}>
                          {b.title}
                        </td>
                        <td>{b.ownerName}</td>
                        <td>
                          <span className="tag tag-genre">{b.genre}</span>
                        </td>
                        <td>
                          <span className={`tag ${b.status === "Available" ? "status-available" : "status-borrowed"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`tag ${
                              b.approvalStatus === "Approved"
                                ? "status-available"
                                : b.approvalStatus === "Rejected"
                                ? ""
                                : "tag-warning"
                            }`}
                            style={
                              b.approvalStatus === "Rejected"
                                ? { background: "#fde8e8", color: "#e74c3c" }
                                : {}
                            }
                          >
                            {b.approvalStatus}
                          </span>
                        </td>
                        <td>
                          <div className="td-actions">
                            <button
                              className="btn btn-sm"
                              style={{
                                background: b.approvalStatus === "Approved" ? "#e74c3c" : "#27ae60",
                                color: "white",
                              }}
                              onClick={() => {
                                if (b.approvalStatus === "Approved") {
                                  rejectBook(b.id);
                                } else {
                                  approveBook(b.id);
                                }
                              }}
                              disabled={moderateBook.isPending}
                            >
                              {b.approvalStatus === "Approved" ? "🚫 Deactivate" : "✓ Activate"}
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
        </>
      )}

      {/* ── ALL USERS TAB ─────────────────────────────────── */}
      {tab === "allUsers" && (
        <>
          {/* Filters */}
          <div className="filter-row" style={{ marginBottom: "1rem" }}>
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              className="filter-select"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="All">Active &amp; Inactive</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {allUsersLoading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading users…</div>
          ) : allUsersError ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#e74c3c" }}>
              Error: {allUsersError.message}
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Approval</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    allUsers.map((u) => (
                      <tr key={u.id}>
                        {/* Name */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div className="comment-avatar">
                              {u.fullName?.[0] || u.userName?.[0] || "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>
                                {u.fullName || u.userName}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: G.muted }}>
                                @{u.userName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ color: G.muted }}>{u.email}</td>

                        {/* Role — inline edit */}
                        <td>
                          {editingRoleUserId === u.id ? (
                            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                              <select
                                value={pendingRole}
                                onChange={(e) => setPendingRole(e.target.value)}
                                style={{
                                  padding: "0.2rem 0.4rem",
                                  borderRadius: 6,
                                  border: `1px solid ${G.creamDark}`,
                                  fontSize: "0.82rem",
                                }}
                              >
                                {ROLES.map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                              <button
                                className="btn btn-sm"
                                style={{ background: "#27ae60", color: "white", padding: "0.2rem 0.5rem" }}
                                onClick={() => confirmRoleChange(u.id)}
                                disabled={changeRole.isPending}
                              >
                                ✓
                              </button>
                              <button
                                className="btn btn-sm btn-ghost"
                                style={{ padding: "0.2rem 0.5rem" }}
                                onClick={() => setEditingRoleUserId(null)}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span className="tag">{u.roles?.join(", ") || "N/A"}</span>
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ padding: "0.15rem 0.4rem", fontSize: "0.75rem" }}
                                onClick={() => startEditRole(u)}
                                title="Change role"
                              >
                                ✏️
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Approval status */}
                        <td>
                          <span
                            className={`tag ${
                              u.approvalStatus === "Approved"
                                ? "status-available"
                                : u.approvalStatus === "Rejected"
                                ? ""
                                : "tag-warning"
                            }`}
                            style={
                              u.approvalStatus === "Rejected"
                                ? { background: "#fde8e8", color: "#e74c3c" }
                                : {}
                            }
                          >
                            {u.approvalStatus}
                          </span>
                        </td>

                        {/* Active status */}
                        <td>
                          <span
                            className={`tag ${u.isActive ? "status-available" : ""}`}
                            style={
                              !u.isActive
                                ? { background: "#f0f0f0", color: "#888" }
                                : {}
                            }
                          >
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="td-actions">
                            {/* Skip self — don't deactivate logged-in admin */}
                            {u.id !== user?.id && (
                              <button
                                className="btn btn-sm"
                                style={{
                                  background: u.isActive ? "#e74c3c" : "#27ae60",
                                  color: "white",
                                }}
                                onClick={() => toggleActive(u)}
                                disabled={setActiveStatus.isPending}
                                title={u.isActive ? "Deactivate user" : "Activate user"}
                              >
                                {u.isActive ? "🚫 Deactivate" : "✓ Activate"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;