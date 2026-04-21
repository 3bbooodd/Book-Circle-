// src/components/ui/Toast.jsx

function Toast({ toasts = [] }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || ""}`}>
          {t.type === "success"
            ? "✓"
            : t.type === "error"
            ? "✕"
            : "ℹ"}{" "}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export default Toast;