import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import BrowsePage from "./pages/BrowsePage";
import MyBooksPage from "./pages/MyBooksPage";
import ReadingListPage from "./pages/ReadingListPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPage from "./pages/AdminPage";

import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";

import { globalStyles, G } from "./styles/globalStyles";
import { useToast } from "./hooks/useToast";

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function NavLinks({ user, hasRole }) {
  const { unreadCount } = useNotifications();

  const navLinks = [
    { id: "browse", label: " Browse", always: true },
    { id: "mybooks", label: " My Books", roles: ["BookOwner"] },
    { id: "reading", label: " Reading List", roles: ["Reader"] },
    { id: "notifications", label: " Notifications", roles: ["Reader", "BookOwner"] },
    { id: "admin", label: " Admin", roles: ["Admin"] },
  ].filter((l) => l.always || (user && hasRole(l.roles)));

  return (
    <div className="navbar-links">
      {navLinks.map((l) => (
        <Link
          key={l.id}
          to={`/${l.id}`}
          className="nav-btn"
        >
          {l.label}
          {l.id === "notifications" && unreadCount > 0 && (
            <span className="badge-pill" style={{ marginLeft: "0.4rem" }}>
              {unreadCount}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

function AppContent() {
  const { user, login, logout, hasRole } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const { toasts, showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  // Inject global styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Navigation links - RBAC based
  // (Moved to NavLinks component to access NotificationContext)

  return (
    <NotificationProvider user={user} onToast={showToast}>
      <BrowserRouter>
        <>
          {/* Navbar */}
        <nav className="navbar">
           <div className="navbar-brand">
            <img
              src="/logo.png"
              alt="BookAholic"
              style={{ width: 110, height: 80, marginRight: 8, marginTop: 8 }}
            /><span> BookAholic</span>
          </div>

          <NavLinks user={user} hasRole={hasRole} />

          <div className="navbar-actions">
            {user ? (
              <>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}>
                  <span style={{ color: G.goldLight, fontWeight: 600 }}>
                    {user.fullName || user.userName || user.name}
                  </span>
                  <span style={{ marginLeft: "0.35rem", opacity: 0.6 }}>
                    · {user.role}
                  </span>
                </div>

                <div className="avatar">{(user.fullName || user.userName || user.name || "U")[0]}</div>

                <button
                  className="btn btn-ghost btn-sm"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <button className="btn btn-gold btn-sm" onClick={() => setShowAuth(true)}>
                Log In
              </button>
            )}
          </div>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route
            path="/mybooks"
            element={
              <ProtectedRoute roles={["BookOwner"]}>
                <MyBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reading"
            element={
              <ProtectedRoute roles={["Reader"]}>
                <ReadingListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute roles={["Reader", "BookOwner"]}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Auth */}
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onLogin={(u) => {
              if (u.status === "Pending") {
                showToast("Your account is under review ⏳", "error");
                return;
              }
              login(u);
              setShowAuth(false);
              showToast(`Welcome, ${u.fullName || u.name}!`, "success");
            }}
          />
        )}

        <Toast toasts={toasts} />
        <Footer />
      </>
    </BrowserRouter>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}