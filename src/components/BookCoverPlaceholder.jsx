// src/components/books/BookCoverPlaceholder.jsx

function BookCoverPlaceholder({ title = "", large = false }) {
  const colors = [
    "#6B1A2A",
    "#4A0F1C",
    "#3D2B1F",
    "#1C4A3A",
    "#2A3D6B",
    "#4A2A6B",
  ];

  const color = colors[title.charCodeAt(0) % colors.length];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        padding: "1rem",
      }}
    >
      <span style={{ fontSize: large ? "3.5rem" : "2.5rem" }}>📖</span>

      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: large ? "0.95rem" : "0.78rem",
          fontWeight: 600,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {title.length > 30 ? title.slice(0, 30) + "…" : title}
      </span>
    </div>
  );
}

export default BookCoverPlaceholder;