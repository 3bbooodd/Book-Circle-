// src/styles/globalStyles.js

export const G = {
  burgundy: "#6B1A2A",
  burgundyDark: "#4A0F1C",
  burgundyLight: "#8B2E42",
  cream: "#FAF6EE",
  creamDark: "#F0E9D8",
  gold: "#C9A84C",
  goldLight: "#E4C97A",
  ink: "#1C1410",
  inkMid: "#3D2B1F",
  inkLight: "#7A5C4A",
  muted: "#B8A898",
  white: "#FFFFFF",
  success: "#2D6A4F",
  error: "#9B2226",
};

export const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.book-cover {
  height: 230px;
  position: relative;
  overflow: hidden;
  background: var(--cream-dark);
}
.book-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

:root {
  --burgundy: ${G.burgundy};
  --burgundy-dark: ${G.burgundyDark};
  --burgundy-light: ${G.burgundyLight};
  --cream: ${G.cream};
  --cream-dark: ${G.creamDark};
  --gold: ${G.gold};
  --gold-light: ${G.goldLight};
  --ink: ${G.ink};
  --ink-mid: ${G.inkMid};
  --ink-light: ${G.inkLight};
  --muted: ${G.muted};
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--ink);
  min-height: 100vh;
}

/* scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream-dark); }
::-webkit-scrollbar-thumb { background: var(--burgundy); border-radius: 3px; }

/* 👇 باقي الكود زي ما هو بدون تغيير */
${/* خلي بقية الـ styles زي ما انت باعتها بالظبط */""}
/* ── Navbar ── */
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: var(--burgundy-dark);
    border-bottom: 2px solid var(--gold);
    padding: 0 2.5rem;
    display: flex; align-items: center; gap: 1.5rem;
    height: 62px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.35);
  }
  .navbar-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.55rem; font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.02em;
    display: flex; align-items: center; gap: 0.5rem;
    cursor: pointer;
    flex-shrink: 0;
  }
  .navbar-brand span { font-style: italic; color: var(--gold-light); }
  .navbar-links {
    display: flex; gap: 0.25rem; align-items: center;
    flex: 1;
  }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem; font-weight: 500;
    color: rgba(255,255,255,0.75);
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .nav-btn:hover, .nav-btn.active {
    background: rgba(201,168,76,0.18);
    color: var(--gold-light);
  }
  .navbar-actions { display: flex; gap: 0.65rem; align-items: center; margin-left: auto; }
  .badge-pill {
    background: var(--gold); color: var(--burgundy-dark);
    font-size: 0.7rem; font-weight: 700;
    padding: 0.15rem 0.45rem; border-radius: 999px;
    font-family: 'DM Sans', sans-serif;
  }
  .avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--burgundy-light));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 0.9rem; font-weight: 600; color: white;
    cursor: pointer; border: 2px solid var(--gold);
    transition: transform 0.2s;
  }
  .avatar:hover { transform: scale(1.08); }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500;
    padding: 0.5rem 1.1rem; border-radius: 7px;
    border: none; cursor: pointer; transition: all 0.2s;
    text-decoration: none;
  }
  .btn-primary {
    background: var(--burgundy); color: white;
    box-shadow: 0 2px 8px rgba(107,26,42,0.35);
  }
  .btn-primary:hover { background: var(--burgundy-light); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(107,26,42,0.45); }
  .btn-gold {
    background: var(--gold); color: var(--burgundy-dark);
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(201,168,76,0.4);
  }
  .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-outline {
    background: transparent; color: var(--burgundy);
    border: 1.5px solid var(--burgundy);
  }
  .btn-outline:hover { background: var(--burgundy); color: white; }
  .btn-ghost {
    background: transparent; color: var(--ink-mid);
    border: 1px solid var(--cream-dark);
  }
  .btn-ghost:hover { background: var(--cream-dark); }
  .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
  .btn-danger { background: var(--error); color: white; }
  .btn-success { background: var(--success); color: white; }

  /* ── Page Layout ── */
  .page { padding: 2rem 2.5rem; max-width: 1400px; margin: 0 auto; }
  .page-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--cream-dark);
    display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
  }
  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem; font-weight: 700; color: var(--burgundy-dark);
    line-height: 1.15;
  }
  .page-subtitle {
    font-family: 'Lora', serif; font-style: italic;
    color: var(--ink-light); font-size: 1rem; margin-top: 0.3rem;
  }

  /* ── Search & Filters ── */
  .search-bar {
    position: relative; flex: 1; max-width: 420px;
  }
  .search-bar input {
    width: 100%; padding: 0.6rem 1rem 0.6rem 2.6rem;
    border: 1.5px solid var(--cream-dark); border-radius: 8px;
    background: white; font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem; color: var(--ink);
    transition: border-color 0.2s;
  }
  .search-bar input:focus { outline: none; border-color: var(--burgundy); }
  .search-bar .icon {
    position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%);
    color: var(--muted); font-size: 1rem; pointer-events: none;
  }
  .filter-row { display: flex; gap: 0.65rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.75rem; }
  .filter-select {
    padding: 0.5rem 0.9rem; border-radius: 7px;
    border: 1.5px solid var(--cream-dark); background: white;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--ink-mid);
    cursor: pointer;
  }
  .filter-select:focus { outline: none; border-color: var(--burgundy); }

  /* ── Book Grid & Card ── */
  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 1.75rem;
  }
  .book-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(28,20,16,0.08);
    transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.05);
  }
  .book-card:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 12px 36px rgba(107,26,42,0.2);
  }
  .book-cover {
    height: 230px;
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, var(--burgundy-dark), var(--burgundy-light));
    display: flex; align-items: center; justify-content: center;
  }
  .book-cover-img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .book-cover-placeholder {
    display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; padding: 1rem;
  }
  .book-cover-placeholder .book-icon { font-size: 3rem; opacity: 0.7; }
  .book-cover-placeholder .cover-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.85rem; font-weight: 600;
    color: rgba(255,255,255,0.9);
    text-align: center; line-height: 1.3;
  }
  .book-status-badge {
    position: absolute; top: 0.6rem; right: 0.6rem;
    padding: 0.2rem 0.55rem; border-radius: 999px;
    font-size: 0.7rem; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
  }
  .status-available { background: #D1FAE5; color: #065F46; }
  .status-borrowed { background: #FEE2E2; color: #991B1B; }
  .book-card-body { padding: 1rem 1.1rem 1.2rem; }
  .book-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem; font-weight: 600; color: var(--ink);
    line-height: 1.35; margin-bottom: 0.25rem;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .book-card-owner {
    font-size: 0.78rem; color: var(--ink-light); margin-bottom: 0.5rem;
  }
  .book-card-meta {
    display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;
  }
  .tag {
    display: inline-block;
    padding: 0.18rem 0.55rem; border-radius: 999px;
    font-size: 0.72rem; font-weight: 500;
    background: var(--cream-dark); color: var(--ink-mid);
    font-family: 'DM Sans', sans-serif;
  }
  .tag-genre { background: #F3E8FF; color: #6B21A8; }
  .tag-lang { background: #E0F2FE; color: #0369A1; }
  .book-card-price {
    font-family: 'Lora', serif; font-weight: 500;
    color: var(--burgundy); font-size: 0.92rem;
  }
  .book-card-likes {
    display: flex; align-items: center; gap: 0.25rem;
    font-size: 0.8rem; color: var(--ink-light);
  }
  .book-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 0.8rem;
  }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(28,20,16,0.7); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .modal {
    background: var(--cream); border-radius: 16px;
    width: 100%; max-width: 660px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.45);
    animation: slideUp 0.25s ease;
  }
  .modal-header {
    padding: 1.5rem 1.75rem 1rem;
    border-bottom: 1px solid var(--cream-dark);
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.45rem; font-weight: 700; color: var(--burgundy-dark);
  }
  .modal-close {
    background: none; border: none; cursor: pointer;
    font-size: 1.4rem; color: var(--ink-light); line-height: 1;
    padding: 0.2rem; border-radius: 4px;
    transition: color 0.15s;
  }
  .modal-close:hover { color: var(--burgundy); }
  .modal-body { padding: 1.5rem 1.75rem; }
  .modal-footer {
    padding: 1rem 1.75rem 1.5rem;
    display: flex; gap: 0.75rem; justify-content: flex-end;
    border-top: 1px solid var(--cream-dark);
  }

  /* ── Book Detail Modal ── */
  .book-detail-grid {
    display: grid; grid-template-columns: 180px 1fr;
    gap: 1.75rem; margin-bottom: 1.5rem;
  }
  .book-detail-cover {
    border-radius: 10px; overflow: hidden;
    height: 250px;
    background: linear-gradient(135deg, var(--burgundy-dark), var(--burgundy-light));
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 0.5rem;
  }
  .book-detail-cover .book-icon { font-size: 3.5rem; }
  .book-detail-info { display: flex; flex-direction: column; gap: 0.5rem; }
  .book-detail-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem; font-weight: 700; color: var(--ink);
    line-height: 1.3;
  }
  .info-row { display: flex; gap: 0.4rem; align-items: baseline; font-size: 0.875rem; }
  .info-label { color: var(--muted); font-weight: 500; min-width: 90px; }
  .info-value { color: var(--ink-mid); }
  .divider { height: 1px; background: var(--cream-dark); margin: 1rem 0; }

  /* ── Comments ── */
  .comment {
    background: white; border-radius: 10px; padding: 1rem 1.1rem;
    margin-bottom: 0.75rem;
    border: 1px solid var(--cream-dark);
  }
  .comment-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
  .comment-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--burgundy));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 700; color: white;
    font-family: 'Playfair Display', serif;
  }
  .comment-author { font-weight: 500; font-size: 0.875rem; color: var(--ink-mid); }
  .comment-date { font-size: 0.75rem; color: var(--muted); }
  .comment-text { font-size: 0.875rem; color: var(--ink); line-height: 1.55; }
  .comment-reply { font-size: 0.78rem; color: var(--burgundy); cursor: pointer; margin-top: 0.4rem; font-weight: 500; }
  .comment-reply:hover { text-decoration: underline; }
  .replies { margin-left: 1.5rem; margin-top: 0.5rem; border-left: 2px solid var(--cream-dark); padding-left: 1rem; }
  .comment-input-row { display: flex; gap: 0.6rem; margin-top: 1rem; }
  .comment-input {
    flex: 1; padding: 0.55rem 0.85rem;
    border: 1.5px solid var(--cream-dark); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--ink);
    background: white; resize: none;
    transition: border-color 0.2s;
  }
  .comment-input:focus { outline: none; border-color: var(--burgundy); }

  /* ── Forms ── */
  .form-group { margin-bottom: 1.1rem; }
  .form-label {
    display: block; font-size: 0.82rem; font-weight: 500;
    color: var(--ink-mid); margin-bottom: 0.4rem;
  }
  .form-input {
    width: 100%; padding: 0.55rem 0.9rem;
    border: 1.5px solid var(--cream-dark); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--ink);
    background: white; transition: border-color 0.2s;
  }
  .form-input:focus { outline: none; border-color: var(--burgundy); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-select {
    width: 100%; padding: 0.55rem 0.9rem;
    border: 1.5px solid var(--cream-dark); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; color: var(--ink);
    background: white; cursor: pointer;
  }
  .form-select:focus { outline: none; border-color: var(--burgundy); }

  /* ── Tables ── */
  .table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid var(--cream-dark); }
  table { width: 100%; border-collapse: collapse; background: white; }
  thead tr { background: var(--burgundy-dark); }
  thead th {
    padding: 0.85rem 1.1rem; text-align: left;
    font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
    font-weight: 600; color: rgba(255,255,255,0.85);
    letter-spacing: 0.04em; text-transform: uppercase;
  }
  tbody tr { border-bottom: 1px solid var(--cream-dark); transition: background 0.15s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--cream); }
  td { padding: 0.85rem 1.1rem; font-size: 0.875rem; color: var(--ink-mid); }
  .td-actions { display: flex; gap: 0.5rem; color: rgba(14, 13, 13, 0.85);}

  /* ── Reading List ── */
  .reading-list-item {
    background: white; border-radius: 10px; padding: 1rem 1.25rem;
    display: flex; align-items: center; gap: 1rem;
    margin-bottom: 0.75rem;
    border: 1px solid var(--cream-dark);
    transition: box-shadow 0.2s;
  }
  .reading-list-item:hover { box-shadow: 0 4px 16px rgba(107,26,42,0.1); }
  .rl-cover {
    width: 44px; height: 60px; border-radius: 5px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--burgundy), var(--burgundy-light));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
  }
  .rl-info { flex: 1; }
  .rl-title { font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 600; color: var(--ink); }
  .rl-meta { font-size: 0.78rem; color: var(--ink-light); margin-top: 0.15rem; }

  /* ── Notification dot ── */
  .notif-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gold); display: inline-block;
    margin-left: 0.35rem;
  }

  /* ── Hero ── */
  .hero {
    background: linear-gradient(135deg, var(--burgundy-dark) 0%, var(--burgundy) 60%, var(--burgundy-light) 100%);
    padding: 3.5rem 2.5rem;
    margin-bottom: 0;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .hero-content { position: relative; max-width: 680px; }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 3rem; font-weight: 700; color: white;
    line-height: 1.15; margin-bottom: 1rem;
  }
  .hero-title em { color: var(--gold-light); font-style: italic; }
  .hero-sub {
    font-family: 'Lora', serif; font-style: italic;
    color: rgba(255,255,255,0.78); font-size: 1.1rem;
    margin-bottom: 2rem; line-height: 1.6;
  }
  .hero-actions { display: flex; gap: 0.85rem; flex-wrap: wrap; }
  .hero-stats {
    display: flex; gap: 2.5rem; margin-top: 3rem;
  }
  .hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem; font-weight: 700; color: var(--gold-light);
  }
  .hero-stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 0.1rem; }

  /* ── Tabs ── */
  .tabs { display: flex; gap: 0; border-bottom: 2px solid var(--cream-dark); margin-bottom: 1.75rem; }
  .tab-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    color: var(--ink-light); padding: 0.75rem 1.25rem;
    border-bottom: 2px solid transparent; margin-bottom: -2px;
    transition: all 0.2s;
  }
  .tab-btn:hover { color: var(--burgundy); }
  .tab-btn.active { color: var(--burgundy); border-bottom-color: var(--burgundy); font-weight: 600; }

  /* ── Toast ── */
  .toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 999; display: flex; flex-direction: column; gap: 0.5rem; }
  .toast {
    background: var(--ink); color: white; padding: 0.75rem 1.25rem;
    border-radius: 10px; font-size: 0.875rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
    animation: slideUp 0.25s ease;
    display: flex; align-items: center; gap: 0.6rem;
    max-width: 320px;
  }
  .toast.success { background: var(--success); }
  .toast.error { background: var(--error); }

  /* ── Empty state ── */
  .empty-state {
    text-align: center; padding: 4rem 2rem;
    color: var(--ink-light);
  }
  .empty-state .empty-icon { font-size: 3.5rem; margin-bottom: 1rem; opacity: 0.5; }
  .empty-state h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem; color: var(--ink-mid); margin-bottom: 0.5rem;
  }
  .empty-state p { font-size: 0.9rem; }

  /* ── Notification Panel ── */
  .notif-panel {
    background: white; border-radius: 12px;
    border: 1px solid var(--cream-dark);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  .notif-item {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--cream-dark);
    display: flex; gap: 0.85rem; align-items: flex-start;
    cursor: pointer; transition: background 0.15s;
  }
  .notif-item:hover { background: var(--cream); }
  .notif-item.unread { background: #FFF9F0; }
  .notif-item:last-child { border-bottom: none; }
  .notif-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 0.1rem; }
  .notif-text { flex: 1; }
  .notif-msg { font-size: 0.875rem; color: var(--ink-mid); line-height: 1.45; }
  .notif-time { font-size: 0.75rem; color: var(--muted); margin-top: 0.25rem; }
.tag-warning {
  background: #fff3cd;
  color: #856404;
}
  .status-pending {
  background: #fff3cd;
  color: #856404;
}
  .navbar-brand {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
}
  .notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 1rem;
}

.notification-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #eee;
  transition: 0.25s;
}

.notification-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

.notif-icon {
  font-size: 1.6rem;
}

.notif-content {
  flex: 1;
}

.notif-title {
  font-weight: 600;
  color: #2c3e50;
}

.notif-sub {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.notif-time {
  font-size: 0.75rem;
  color: #aaa;
}
`;