import { useState } from "react";
import { G } from "../styles/globalStyles";

function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("Reader");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
    const roles = {
      Admin: "admin",
      "Book Owner": "owner",
      Reader: "reader",
    };

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // 🔍 نلاقي user بنفس الإيميل + role
    const existingUser = allUsers.find(
      (u) => u.email === email && u.role === roles[role]
    );

    // =========================
    // 🧠 LOGIN
    // =========================
    if (isLogin) {
      if (!existingUser) {
        alert("User not found ❌");
        return;
      }

      // 🔥 منع الدخول لو Pending
      if (existingUser.status === "Pending") {
        alert("Your account is under review ⏳");
        return;
      }

      // 🔐 check password
      if (existingUser.password !== password) {
        alert("Wrong password ❌");
        return;
      }

      onLogin(existingUser);
      onClose();
      return;
    }

    // =========================
    // 📝 REGISTER
    // =========================

    // ❌ منع duplicate email
    const emailExists = allUsers.some((u) => u.email === email);
    if (emailExists) {
      alert("Email already exists ❌");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name || email.split("@")[0],
      email,
      password,
      role: roles[role],
      status: role === "Book Owner" ? "Pending" : "Active", // 🔥 المهم
      joined: "Now",
    };

    // 🔥 نحفظه في localStorage
    localStorage.setItem(
      "users",
      JSON.stringify([...allUsers, newUser])
    );

    alert(
      newUser.status === "Pending"
        ? "Account created. Waiting for admin approval ⏳"
        : "Account created successfully ✅"
    );

    // 🔥 لو مش Pending دخّله
    if (newUser.status === "Active") {
      onLogin(newUser);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            {isLogin ? "Welcome back" : "Join BookCircle"}
          </div>

          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Name */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Role (Register) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">I am a…</label>

              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Reader</option>
                <option>Book Owner</option>
              </select>

              {role === "Book Owner" && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: G.muted,
                    marginTop: "0.35rem",
                    fontStyle: "italic",
                  }}
                >
                  Your account will be reviewed by an admin before activation.
                </p>
              )}
            </div>
          )}

          {/* Role (Login switch) */}
          {isLogin && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              {["Admin", "Book Owner", "Reader"].map((label) => (
                <button
                  key={label}
                  className={`btn btn-sm ${
                    role === label ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setRole(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="modal-footer"
          style={{ flexDirection: "column", gap: "0.5rem" }}
        >
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={submit}
          >
            {isLogin ? "Log In" : "Create Account"}
          </button>

          <button
            className="btn btn-ghost"
            style={{ width: "100%" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;