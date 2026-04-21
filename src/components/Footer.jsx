function Footer() {
  return (
    <footer
      style={{
        marginTop: "3rem",
        padding: "2rem",
        background: "#4A0F1C",
        color: "white",
        textAlign: "center",
      }}
    >
      <h3 style={{ fontFamily: "'Playfair Display'" }}>
        BOOKAHOLIC
      </h3>

      <p style={{ marginTop: "0.5rem", opacity: 0.8 }}>
        Share books. Build community.
      </p>

      <div style={{ marginTop: "1rem", fontSize: "0.85rem", opacity: 0.6 }}>
        © {new Date().getFullYear()} BookAholic — All rights reserved
      </div>
    </footer>
  );
}

export default Footer;