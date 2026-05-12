import { useState } from "react";
import { G } from "../styles/globalStyles";
import { login, register } from "../services/authService";

function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("BookOwner");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      // =========================
      // 🧠 LOGIN
      // =========================
      if (isLogin) {
        const result = await login({ emailOrUserName: email, password });
        onLogin(result);
        onClose();
        return;
      }

      // =========================
      // 📝 REGISTER
      // =========================

      // Validation
      if (!fullName || !userName || !email || !password || !confirmPassword) {
        setError("Please fill in all fields ❌");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match ❌");
        setLoading(false);
        return;
      }

      const result = await register({
        fullName,
        email,
        userName,
        password,
        confirmPassword,
        role,
      });

      // BookOwner requires admin approval - don't auto-login
      if (role === "BookOwner") {
        setError("Account created! Please wait for admin approval before logging in ⏳");
        setTimeout(() => {
          onClose();
          setIsLogin(true); // Switch to login tab
        }, 2500);
      } else if (result.status === "Pending") {
        setError("Account created. Waiting for admin approval ⏳");
      } else {
        onLogin(result);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Authentication failed ❌");
    } finally {
      setLoading(false);
    }
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
          {/* Full Name */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
          )}

          {/* Username */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Choose a username"
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

          {/* Confirm Password */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Role (Register only) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Reader">Reader</option>
                <option value="BookOwner">Book Owner</option>
              </select>

              {role === "BookOwner" && (
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

          {/* Error Message */}
          {error && (
            <div
              style={{
                fontSize: "0.85rem",
                color: "#e74c3c",
                padding: "0.5rem",
                backgroundColor: "#fde8e8",
                borderRadius: "4px",
                marginTop: "0.5rem",
              }}
            >
              {error}
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
            disabled={loading}
          >
            {loading ? "Processing..." : (isLogin ? "Log In" : "Create Account")}
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