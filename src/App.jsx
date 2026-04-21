import { useState, useEffect } from "react";

import BrowsePage from "./pages/BrowsePage";
import MyBooksPage from "./pages/MyBooksPage";
import ReadingListPage from "./pages/ReadingListPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminPage from "./pages/AdminPage";

import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";

import { BOOKS } from "./services/mockData";
import { USERS } from "./services/mockData";
import { globalStyles, G } from "./styles/globalStyles";

export default function App() {
  const [page, setPage] = useState("browse");
  const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("currentUser");
  return saved ? JSON.parse(saved) : null;
});

  // 📚 BOOKS (with localStorage)
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem("books");
    return saved ? JSON.parse(saved) : BOOKS;
  });
  useEffect(() => {
  console.log("BOOKS:", books);
}, [books]);

  // 👤 USERS
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved ? JSON.parse(saved) : USERS;
  });

  const [showAuth, setShowAuth] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [readingList, setReadingList] = useState(() => {
  const saved = localStorage.getItem("readingList");
  return saved ? JSON.parse(saved) : {};
});
  const [notifCount, setNotifCount] = useState();

  // 💾 save books
  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  // 💾 save users
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
  localStorage.setItem("readingList", JSON.stringify(readingList));
}, [readingList]);

  // 🎨 styles
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 🔔 toast
  const showToast = (msg, type = "") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, msg, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };
const onLike = (bookId) => {
  if (!user) return;

  setBooks(prev =>
    prev.map(b => {
      if (b.id !== bookId) return b;

      const likedBy = b.likedBy || [];
      const alreadyLiked = likedBy.includes(user.id);

      if (alreadyLiked) {
        return {
          ...b,
          likes: b.likes - 1,
          likedBy: likedBy.filter(id => id !== user.id),
        };
      } else {
        return {
          ...b,
          likes: b.likes + 1,
          likedBy: [...likedBy, user.id],
        };
      }
    })
  );
};
// const addComment = (bookId, text, parentCommentId = null) => {
//   setBooks((prevBooks) => {
//     const updatedBooks = prevBooks.map((book) => {
//       if (book.id === bookId) {
//         const newComment = {
//           id: crypto.randomUUID(),
//           user: user.name,
//           text: text,
//           date: new Date().toLocaleString(),
//           replies: [],
//         };

//         if (parentCommentId) {
//           // إضافة رد
//           return {
//             ...book,
//             comments: (book.comments || []).map((c) =>
//               c.id === parentCommentId
//                 ? { ...c, replies: [...(c.replies || []), newComment] }
//                 : c
//             ),
//           };
//         }
//         // إضافة تعليق رئيسي
//         return {
//           ...book,
//           comments: [...(book.comments || []), newComment],
//         };
//       }
//       return book;
//     });
//      const oldNotifs = JSON.parse(localStorage.getItem("notifications") || "[]");

//   const newNotif = {
//     id: crypto.randomUUID(),
//     type: "comment",
//     text: `${user.name} commented on a book`,
//     bookId,
//     time: "Just now",
//   };

//   localStorage.setItem(
//     "notifications",
//     JSON.stringify([...oldNotifs, newNotif])
//   );

//   // 🔥 Real-time trigger
//   window.dispatchEvent(new Event("newNotification"));

//     // حفظ في localStorage فوراً للتأكيد
//     localStorage.setItem("books", JSON.stringify(updatedBooks));
//     return updatedBooks;
//   });
// };
  

const addComment = (bookId, text, parentCommentId = null) => {
  setBooks((prevBooks) => {
    const updatedBooks = prevBooks.map((book) => {
      if (book.id === bookId) {
        const newComment = {
          id: crypto.randomUUID(),
          user: user.name,
          text: text,
          date: new Date().toLocaleString(),
          replies: [],
        };

        if (parentCommentId) {
          // إضافة رد
          return {
            ...book,
            comments: (book.comments || []).map((c) =>
              c.id === parentCommentId
                ? { ...c, replies: [...(c.replies || []), newComment] }
                : c
            ),
          };
        }
        // إضافة تعليق رئيسي
        return {
          ...book,
          comments: [...(book.comments || []), newComment],
        };
      }
      return book;
    });
     const oldNotifs = JSON.parse(localStorage.getItem("notifications") || "[]");

  const newNotif = {
    id: crypto.randomUUID(),
    type: "comment",
    text: `${user.name} commented on a book`,
    bookId,
    time: "Just now",
  };

  localStorage.setItem(
    "notifications",
    JSON.stringify([...oldNotifs, newNotif])
  );

  // 🔥 Real-time trigger
  window.dispatchEvent(new Event("newNotification"));

    // حفظ في localStorage فوراً للتأكيد
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    return updatedBooks;
  });
};
   // إضافة كتاب جديد
const addBook = (newBook) => {
  setBooks(prev => [...prev, { ...newBook, id: crypto.randomUUID(), comments: [], likes: 0 }]);
  showToast("Book added successfully!", "success");
};

// تحديث كتاب موجود
const updateBook = (updatedBook) => {
  setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  showToast("Book updated successfully!", "success");
};

// حذف كتاب
const deleteBook = (id) => {
  if (window.confirm("Are you sure you want to delete this book?")) {
    setBooks(prev => prev.filter(b => b.id !== id));
    showToast("Book deleted.", "info");
  }
};
  // 🔥 دالة تحديث حالة الكتاب (للإرجاع أو الإتاحة)
  const updateBookStatus = (bookId, newStatus) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
    );
    showToast(`Book is now ${newStatus}`, "success");
  };

  // const onBorrow = (book) => {
  //   const newRequest = {
  //     id: crypto.randomUUID(),
  //     bookId: book.id,
  //     book: book.title,
  //     requester: user.name,
  //     status: "Pending",
  //   };

  //   const old = JSON.parse(localStorage.getItem("requests") || "[]");
  //   localStorage.setItem("requests", JSON.stringify([...old, newRequest]));
  //   showToast("Borrow request sent ⏳", "success");
  // };
//   const onBorrow = (book) => {
//   const newRequest = {
//     id: crypto.randomUUID(),
//     bookId: book.id,
//     book: book.title,
//     requester: user.name,
//     ownerId: book.ownerId, // 🔥 مهم
//     status: "Pending",
//   };

//   const old = JSON.parse(localStorage.getItem("requests") || "[]");
//   localStorage.setItem("requests", JSON.stringify([...old, newRequest]));

//   showToast("Borrow request sent ⏳", "success");
// };
const onBorrow = (book) => {
  const newRequest = {
    id: crypto.randomUUID(),
    bookId: book.id,
    book: book.title,
    requester: user.name,
    ownerId: book.ownerId,
    status: "Pending",
  };

  const old = JSON.parse(localStorage.getItem("requests") || "[]");
  localStorage.setItem("requests", JSON.stringify([...old, newRequest]));

  // 🔥 ده المهم (simulate real-time)
  window.dispatchEvent(new Event("newNotification"));

  showToast("Borrow request sent ⏳", "success");
};

  const onAddToList = (book) => {
  if (!user) return;

  setReadingList((prev) => {
    const userList = prev[user.id] || [];

    if (userList.some((b) => b.id === book.id)) return prev;

    return {
      ...prev,
      [user.id]: [...userList, book],
    };
  });

  showToast(`"${book.title}" added to your reading list!`, "success");
};

  // const onRemoveFromList = (id) => {
  //   setReadingList((prev) => prev.filter((b) => b.id !== id));
  // };
  const onRemoveFromList = (bookId) => {
  if (!user) return;

  setReadingList((prev) => {
    const userList = prev[user.id] || [];

    return {
      ...prev,
      [user.id]: userList.filter((b) => b.id !== bookId),
    };
  });
};

  // 🔓 logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    setPage("browse");
    showToast("Logged out.");
  };

  // 🔗 nav
  const navLinks = [
    { id: "browse", label: " Browse", always: true },
    { id: "mybooks", label: " My Books", roles: ["owner"] },
    { id: "reading", label: " Reading List", roles: ["reader", "owner"] },
    { id: "notifications", label: " Notifications", roles: [ "owner"] },
    { id: "admin", label: " Admin", roles: ["admin"] },
  ].filter((l) => l.always || (user && l.roles?.includes(user.role)));

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
         <div className="navbar-brand" onClick={() => setPage("browse")}>
  <img
    src="/logo.png"
    alt="BookAholic"
    style={{ width: 110, height: 80, marginRight: 8,marginTop:8 }} 
  /><span> BookAholic</span>
 
</div>

        <div className="navbar-links">
          {navLinks.map((l) => (
            <button
              key={l.id}
              className={`nav-btn ${page === l.id ? "active" : ""}`}
              onClick={() => setPage(l.id)}
            >
              {l.label}

              {l.id === "notifications" && notifCount > 0 && (
                <span className="badge-pill">{notifCount}</span>
              )}

              {l.id === "reading" && readingList.length > 0 && (
                <span className="badge-pill">{readingList.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.65)" }}>
                <span style={{ color: G.goldLight, fontWeight: 600 }}>
                  {user.name}
                </span>
                <span style={{ marginLeft: "0.35rem", opacity: 0.6 }}>
                  · {user.role}
                </span>
              </div>

              <div className="avatar">{user.name[0]}</div>

              <button
                className="btn btn-ghost btn-sm"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                onClick={logout}
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
      {page === "browse" && (
        <BrowsePage
          books={books}
          user={user}
          onBorrow={onBorrow}
          onLike={onLike} // 🔥 ممررة لعمل اللايك
          readingList={readingList}
          onAddToList={onAddToList}
          onAddComment={addComment}
        />
      )}

      {page === "mybooks" && (
        <MyBooksPage
          showToast={showToast}
          books={books}
          setBooks={setBooks}
          user={user}
          onAdd={addBook} 
          onUpdate={updateBook} 
          onDelete={deleteBook}  
          onReturnBook={(id) => updateBookStatus(id, "Available")} // 🔥 ممررة لإرجاع الكتاب
        />
      )}

      {page === "reading" && (
        <ReadingListPage
  readingList={readingList[user?.id] || []} // 🔥 أهم سطر
  onRemove={onRemoveFromList}
/>
      )}

      {page === "notifications" && <NotificationsPage />}

      {page === "admin" && (
        <AdminPage
          showToast={showToast}
          users={users}
          setUsers={setUsers}
          books={books}
          setBooks={setBooks}
          onUpdateStatus={updateBookStatus} // 🔥 ممررة للأدمن للتحكم الكامل
        />
      )}

      {/* Auth */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={(u) => {
            if (u.status === "Pending") {
              showToast("Your account is under review ⏳", "error");
              return;
            }

            setUser(u);
            localStorage.setItem("currentUser", JSON.stringify(u));

            setUsers((prev) => {
              const exists = prev.some(
                (user) => user.email === u.email && user.role === u.role
              );
              if (exists) return prev;
              return [...prev, u];
            });

            showToast(`Welcome, ${u.name}!`, "success");
          }}
        />
      )}

      <Toast toasts={toasts} />
      <Footer />
    </>
  );
}