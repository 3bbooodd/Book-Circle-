import { useState } from "react";

function CommentsSection({ bookId, comments = [], user, onAddComment }) {
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);

  // إضافة كومنت
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    if (user.role !== 'Reader') {
      alert("Only Readers can leave comments.");
      return;
    }

    if (onAddComment) {
      onAddComment(bookId, text);
      setText("");
    }
  };

  // 💬 إضافة رد (level واحد)
  const handleReplySubmit = (parentId) => {
    if (!replyText.trim()) return;

    if (!user) {
      alert("You must be logged in to reply.");
      return;
    }

    if (user.role !== 'Reader') {
      alert("Only Readers can reply to comments.");
      return;
    }

    if (onAddComment) {
      onAddComment(bookId, replyText, parentId);
      setReplyText("");
      setActiveReplyId(null);
    }
  };

  return (
    <div className="comments-section" style={{ marginTop: "20px" }}>
      <h4 style={{ marginBottom: "15px", color: "#2c3e50" }}>
        Comments ({comments.length})
      </h4>

      {/* 🔥 INPUT (Readers only) */}
      {user?.role === 'Reader' ? (
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
          <input
            type="text"
            placeholder="Write a public comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ddd",
              outline: "none",
            }}
          />

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ borderRadius: "20px", padding: "0 20px" }}
          >
            Post
          </button>
        </form>
      ) : user ? (
        <p
          style={{
            fontSize: "0.9rem",
            color: "#e67e22",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          📝 Only Readers can leave comments.
        </p>
      ) : (
        <p
          style={{
            fontSize: "0.9rem",
            color: "#7f8c8d",
            marginBottom: "20px",
          }}
        >
          Log in to leave a comment.
        </p>
      )}

      {/* 📃 COMMENTS LIST */}
      <div className="comments-list">
        {comments.length === 0 && (
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            No comments yet.
          </p>
        )}

        {comments.map((c) => (
          <div key={c.id} style={{ marginBottom: "20px" }}>
            <div
              style={{
                background: "#f8f9fa",
                padding: "12px",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  color: "#34495e",
                }}
              >
                {c.userName}
              </div>

              <div style={{ margin: "5px 0", fontSize: "0.95rem" }}>
                {c.content}
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <span style={{ fontSize: "0.75rem", color: "#95a5a6" }}>
                  {c.createdAtUtc ? new Date(c.createdAtUtc).toLocaleDateString() : "Just now"}
                </span>

                {user?.role === 'Reader' && (
                  <button
                    onClick={() =>
                      setActiveReplyId(
                        activeReplyId === c.id ? null : c.id
                      )
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3498db",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                    }}
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>

            {/* 🔁 REPLIES */}
            {c.replies &&
              c.replies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    marginLeft: "40px",
                    marginTop: "10px",
                    background: "#f0f2f5",
                    padding: "10px",
                    borderRadius: "10px",
                    borderLeft: "3px solid #ddd",
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                    {reply.userName}
                  </div>

                  <div style={{ fontSize: "0.9rem" }}>
                    {reply.content}
                  </div>

                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#95a5a6",
                    }}
                  >
                    {reply.createdAtUtc ? new Date(reply.createdAtUtc).toLocaleDateString() : "Just now"}
                  </div>
                </div>
              ))}

            {/* ✍️ REPLY INPUT */}
            {activeReplyId === c.id && (
              <div
                style={{
                  marginLeft: "40px",
                  marginTop: "10px",
                  display: "flex",
                  gap: "5px",
                }}
              >
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "5px 10px",
                    borderRadius: "15px",
                    border: "1px solid #ddd",
                    fontSize: "0.85rem",
                  }}
                />

                <button
                  onClick={() => handleReplySubmit(c.id)}
                  className="btn btn-sm"
                  style={{
                    borderRadius: "15px",
                    fontSize: "0.75rem",
                  }}
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsSection;