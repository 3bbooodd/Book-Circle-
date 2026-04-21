// import { useNavigate, useLocation } from "react-router-dom";

// export default function Navbar({
//   user,
//   readingList,
//   notifCount,
//   logout,
// }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navLinks = [
//     { path: "/browse", label: "📚 Browse", always: true },
//     { path: "/mybooks", label: "📖 My Books", roles: ["owner"] },
//     { path: "/reading", label: "📌 Reading List", roles: ["reader", "owner"] },
//     { path: "/notifications", label: "🔔 Notifications", roles: ["reader", "owner", "admin"] },
//     { path: "/admin", label: "⚙️ Admin", roles: ["admin"] },
//   ].filter(l => l.always || (user && l.roles?.includes(user.role)));

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand" onClick={() => navigate("/browse")}>
//         📖 Book<span>Circle</span>
//       </div>

//       <div className="navbar-links">
//         {navLinks.map(link => (
//           <button
//             key={link.path}
//             className={`nav-btn ${location.pathname === link.path ? "active" : ""}`}
//             onClick={() => navigate(link.path)}
//           >
//             {link.label}

//             {link.path === "/notifications" && notifCount > 0 && (
//               <span className="badge-pill">{notifCount}</span>
//             )}

//             {link.path === "/reading" && readingList.length > 0 && (
//               <span className="badge-pill">{readingList.length}</span>
//             )}
//           </button>
//         ))}
//       </div>

//       <div className="navbar-actions">
//         {user ? (
//           <>
//             <span style={{ color: "white" }}>{user.name}</span>
//             <button className="btn btn-ghost btn-sm" onClick={logout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <button className="btn btn-gold btn-sm">
//             Log In
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({
  user,
  readingList,
  notifCount,
  logout,
  setShowAuth
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/browse", label: "📚 Browse", always: true },
    { path: "/mybooks", label: "📖 My Books", roles: ["owner"] },
    { path: "/reading", label: "📌 Reading List", roles: ["reader", "owner"] },
    { path: "/notifications", label: "🔔 Notifications", roles: ["reader", "owner", "admin"] },
    { path: "/admin", label: "⚙️ Admin", roles: ["admin"] },
  ].filter(l => l.always || (user && l.roles?.includes(user.role)));

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/browse")}>
        📖 Book<span>Circle</span>
      </div>

      <div className="navbar-links">
        {navLinks.map(link => (
          <button
            key={link.path}
            className={`nav-btn ${location.pathname === link.path ? "active" : ""}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}

            {link.path === "/notifications" && notifCount > 0 && (
              <span className="badge-pill">{notifCount}</span>
            )}

            {link.path === "/reading" && readingList.length > 0 && (
              <span className="badge-pill">{readingList.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <span style={{ color: "white" }}>{user.name}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn btn-gold btn-sm" onClick={() => setShowAuth(true)}>
            Log In
          </button>
        )}
      </div>
    </nav>
  );
}